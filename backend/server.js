// server.js
require('dotenv').config();
global.WebSocket = require('ws'); // Prevents Node realtime-js websocket crashes
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL, methods: ["GET", "POST"] },
  maxHttpBufferSize: 1e8 // Limit payload size to 100MB for document exchanges
});

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || "skillswapproductions@gmail.com";

// Optional Google OAuth2 credentials setup for Gmail notifications [30]
let gmail = null;
if (process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET && process.env.GMAIL_REFRESH_TOKEN) {
  try {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI
    );
    oAuth2Client.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });
    gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
    console.log('[Gmail API] Client initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize Gmail API client:', err.message);
  }
} else {
  console.log('[Gmail API] Missing OAuth2 credentials in .env. Running in Local-File Mode.');
}

const connectedUsers = new Map();

// Unified Email Notifier (Writes to local temp file + falls back to Gmail API)
async function sendEmailNotification(to, subject, htmlContent) {
  const logEntry = `
============================================================
TIMESTAMP: ${new Date().toISOString()}
TO: ${to}
SUBJECT: ${subject}
CONTENT:
${htmlContent}
============================================================
\n`;

  const logPath = path.join(__dirname, 'temp_emails.log');
  try {
    fs.appendFileSync(logPath, logEntry);
    console.log(`[Email Logger] Local notification saved to: ${logPath}`);
  } catch (err) {
    console.error('Failed to write to temp email log:', err);
  }

  if (gmail) {
    try {
      const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
      const messageParts = [
        `To: ${to}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${utf8Subject}`,
        '',
        htmlContent,
      ];
      const message = messageParts.join('\n');
      const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      await gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw: encodedMessage },
      });
      console.log('[Gmail API] Real email delivered successfully.');
    } catch (err) {
      console.error('[Gmail API] Delivery failed. Reason:', err.message);
    }
  }
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('register_user', async (userId) => {
    connectedUsers.set(userId, socket.id);

    const { data: settings } = await supabase
      .from('user_settings')
      .select('show_online_status')
      .eq('user_id', userId)
      .maybeSingle();

    const showOnline = settings ? settings.show_online_status : true;

    if (showOnline) {
      await supabase.from('users').update({ is_online: true }).eq('user_id', userId);
      io.emit('user_status_change', { userId, status: 'Online' });
    } else {
      await supabase.from('users').update({ is_online: false }).eq('user_id', userId);
      io.emit('user_status_change', { userId, status: 'Offline' });
    }
  });

  socket.on('join_room', (matchId) => {
    socket.join(matchId);
  });

  // Socket-driven active security report processor (Optimization 2)
  socket.on('report_user', async (data) => {
    const { reporter_id, reported_id, reason } = data;
    console.log(`\n[Socket Security Monitor] Security Report filed: from ${reporter_id} against ${reported_id}`);

    try {
      const { data: adminUser } = await supabase
        .from('users')
        .select('user_id')
        .ilike('email', ADMIN_EMAIL)
        .maybeSingle();

      if (adminUser) {
        const isAdminOnline = connectedUsers.has(adminUser.user_id);
        console.log(`Is Administrator Online?: ${isAdminOnline ? 'YES (Skipping Email)' : 'NO (Triggering Offline Email)'}`);

        if (!isAdminOnline) {
          const { data: adminSettings } = await supabase
            .from('user_settings')
            .select('email_notifications')
            .eq('user_id', adminUser.user_id)
            .maybeSingle();

          const wantsEmail = adminSettings ? adminSettings.email_notifications : true;
          console.log(`Does Administrator accept email reports?: ${wantsEmail ? 'YES' : 'NO'}`);

          if (wantsEmail) {
            const { data: reporter } = await supabase.from('users').select('username').eq('user_id', reporter_id).maybeSingle();
            const { data: reported } = await supabase.from('users').select('username').eq('user_id', reported_id).maybeSingle();

            const reporterName = reporter ? reporter.username : "Anonymous Reporter";
            const reportedName = reported ? reported.username : "Unknown Subject";

            const subject = `[SECURITY ALERT] New User Report Filed on SkillSwap`;
            const html = `
            <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 40px 10px; text-align: center;">
              <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; border: 2px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); text-align: left;">
                
                <div style="background-color: #ef4444; padding: 30px; text-align: center;">
                  <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.05em; font-family: sans-serif;">
                    SkillSwap Safety
                  </h2>
                </div>

                <div style="padding: 40px 30px;">
                  <h3 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 12px; font-family: sans-serif; text-align: center;">Security Alert Dispatched</h3>
                  <p style="color: #475569; font-size: 14px; font-weight: 600; line-height: 1.6; margin-bottom: 24px; font-family: sans-serif;">
                    Hello Admin,<br />
                    An active safety report has been filed and requires administrative attention:
                  </p>

                  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
                    <p style="color: #475569; font-size: 13px; margin: 0 0 8px 0; font-family: sans-serif;"><b>Reporter:</b> ${reporterName} (${reporter_id})</p>
                    <p style="color: #475569; font-size: 13px; margin: 0 0 8px 0; font-family: sans-serif;"><b>Reported User:</b> <span style="color: #ef4444; font-weight: bold;">${reportedName}</span> (${reported_id})</p>
                    <p style="color: #475569; font-size: 13px; margin: 0; font-family: sans-serif;"><b>Reason:</b> <span style="background-color: #fee2e2; color: #ef4444; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${reason}</span></p>
                  </div>

                  <div style="text-align: center;">
                    <a href="${process.env.FRONTEND_URL}" style="display: inline-block; background-color: #ef4444; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 16px; font-size: 14px; font-weight: 900; font-family: sans-serif; box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.3);">
                      Access Moderation Console
                    </a>
                  </div>
                </div>

                <div style="background-color: #f8fafc; padding: 20px; border-top: 1px solid #f1f5f9; text-align: center;">
                  <p style="color: #94a3b8; font-size: 10px; font-weight: bold; text-transform: uppercase; margin: 0; letter-spacing: 0.1em; font-family: sans-serif;">
                    © 2026 SkillSwap • Safety & Moderation Module
                  </p>
                </div>

              </div>
            </div>`;

            await sendEmailNotification(ADMIN_EMAIL, subject, html);
          }
        }
      }
    } catch (err) {
      console.error('[Socket Security Monitor] Failed to process report dispatch:', err.message);
    }
  });

  socket.on('resolve_report', async (data) => {
    const { report_id } = data;
    console.log(`\n[Socket Security Monitor] Admin resolving Report: ${report_id}`);

    try {
      io.emit('report_status_changed', { report_id, status: 'Resolved' });
    } catch (err) {
      console.error('[Socket Security Monitor] Failed to process resolution event:', err.message);
    }
  });

  socket.on('send_message', async (data) => {
    const { match_id, sender_id, receiver_id, content, file_name, file_url, message_type } = data;

    io.to(match_id).emit('receive_message', data);

    await supabase.from('messages').insert([{
      match_id, sender_id, content, file_name, file_url, message_type
    }]);

    const receiverSocket = connectedUsers.get(receiver_id);
    
    console.log(`\n--- MESSAGE SENT ---`);
    console.log(`Sender: ${sender_id}`);
    console.log(`Receiver: ${receiver_id}`);
    console.log(`Is Receiver Online on Socket?: ${receiverSocket ? 'YES' : 'NO (Triggering Email)'}`);

    if (!receiverSocket) {
      const { data: receiverSettings } = await supabase
        .from('user_settings')
        .select('email_notifications')
        .eq('user_id', receiver_id)
        .maybeSingle();

      const wantsEmail = receiverSettings ? receiverSettings.email_notifications : true;
      console.log(`Does Receiver want email notifications?: ${wantsEmail ? 'YES' : 'NO'}`);

      if (wantsEmail) {
        const { data: receiver } = await supabase.from('users').select('email, username').eq('user_id', receiver_id).single();
        const { data: sender = { username: "A peer" } } = await supabase.from('users').select('username').eq('user_id', sender_id).single();
        if (receiver) {
          const subject = `New Message from ${sender.username} on SkillSwap`;
          
          const html = `
          <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 40px 10px; text-align: center;">
            <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; border: 2px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); text-align: left;">
              
              <div style="background-color: #4f46e5; padding: 30px; text-align: center;">
                <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.05em; font-family: sans-serif;">
                  Skill<span style="color: #c7d2fe; font-style: italic;">Swap</span>
                </h2>
              </div>

              <div style="padding: 40px 30px;">
                <h3 style="color: #0f172a; font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 12px; font-family: sans-serif; text-align: center;">New Offline Message</h3>
                <p style="color: #475569; font-size: 14px; font-weight: 600; line-height: 1.6; margin-bottom: 24px; font-family: sans-serif;">
                  Hi ${receiver.username},<br />
                  While you were away, <b>${sender.username}</b> sent you a message:
                </p>

                <div style="background-color: #f1f5f9; border-left: 4px solid #4f46e5; padding: 16px; border-radius: 8px; margin-bottom: 30px;">
                  <p style="color: #0f172a; font-size: 14px; font-style: italic; font-weight: 600; margin: 0; font-family: sans-serif;">
                    "${content || 'Shared a file attachment'}"
                  </p>
                </div>

                <div style="text-align: center;">
                  <a href="${process.env.FRONTEND_URL}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 16px; font-size: 14px; font-weight: 900; font-family: sans-serif; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);">
                    Reply on SkillSwap
                  </a>
                </div>
              </div>

              <div style="background-color: #f8fafc; padding: 20px; border-top: 1px solid #f1f5f9; text-align: center;">
                <p style="color: #94a3b8; font-size: 10px; font-weight: bold; text-transform: uppercase; margin: 0; letter-spacing: 0.1em; font-family: sans-serif;">
                  © 2026 SkillSwap • Peer-to-Peer Learning
                </p>
              </div>

            </div>
          </div>`;
          await sendEmailNotification(receiver.email, subject, html);
        }
      }
    }
    console.log(`--------------------\n`);
  });

  socket.on('typing', ({ match_id, isTyping }) => {
    socket.to(match_id).emit('partner_typing', isTyping);
  });

  socket.on('disconnect', async () => {
    for (let [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        
        // Grace-period delay prevents connection drop-outs on page refreshes
        setTimeout(async () => {
          if (!connectedUsers.has(userId)) {
            await supabase.from('users').update({ is_online: false }).eq('user_id', userId);
            io.emit('user_status_change', { userId, status: 'Offline' });
          }
        }, 1500);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Backend running on port ${PORT}`));