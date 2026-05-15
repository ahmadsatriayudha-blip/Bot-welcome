// welcome.js
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');

const WELCOME_BG = 'https://4kwallpapers.com/images/wallpapers/demon-slayer--17643.jpg';
const GOODBYE_BG  = 'https://wallpapercave.com/wp/wp7085179.jpg';

const WELCOME_CHANNEL = '1452201734297616595';
const GOODBYE_CHANNEL  = '1452437574097436764';

async function createCard(member, type) {
  const canvas = createCanvas(1024, 400);
  const ctx    = canvas.getContext('2d');

  // ── Background ──────────────────────────────────────────────────
  try {
    const bg = await loadImage(type === 'welcome' ? WELCOME_BG : GOODBYE_BG);
    ctx.drawImage(bg, 0, 0, 1024, 400);
  } catch {
    ctx.fillStyle = type === 'welcome' ? '#1a1a2e' : '#2e1a1a';
    ctx.fillRect(0, 0, 1024, 400);
  }

  // ── Dark overlay ─────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, 0, 1024, 400);

  // ── Avatar circle ────────────────────────────────────────────────
  const cx = 512, cy = 140, r = 80;
  const avatarURL = member.user.displayAvatarURL({ extension: 'png', size: 256 });

  try {
    const avatar = await loadImage(avatarURL);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, cx - r, cy - r, r * 2, r * 2);
    ctx.restore();
  } catch {
    // fallback: colored circle
    ctx.fillStyle = '#5865f2';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Avatar border ────────────────────────────────────────────────
  ctx.beginPath();
  ctx.arc(cx, cy, r + 6, 0, Math.PI * 2);
  ctx.strokeStyle = type === 'welcome' ? '#ffd700' : '#ff4444';
  ctx.lineWidth   = 6;
  ctx.stroke();

  // ── WELCOME / GOODBYE text ───────────────────────────────────────
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.font         = 'bold 70px sans-serif';
  ctx.fillStyle    = type === 'welcome' ? '#00e676' : '#ff5252';

  // Shadow
  ctx.shadowColor   = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur    = 10;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  ctx.fillText(type === 'welcome' ? 'WELCOME' : 'GOODBYE', cx, 268);

  // ── Username ─────────────────────────────────────────────────────
  ctx.font         = 'bold 28px sans-serif';
  ctx.fillStyle    = '#ffffff';
  ctx.shadowBlur   = 6;
  ctx.fillText(member.user.tag, cx, 320);

  ctx.shadowColor = 'transparent';

  return canvas.toBuffer('image/png');
}

async function sendWelcome(member) {
  try {
    const channel = await member.guild.channels.fetch(WELCOME_CHANNEL);
    if (!channel) return;

    const buffer     = await createCard(member, 'welcome');
    const attachment = new AttachmentBuilder(buffer, { name: 'welcome.png' });

    await channel.send({
      content: `Hai <@${member.id}> selamat datang di server ini semoga betah ya 👋`,
      files:   [attachment],
    });
  } catch (err) {
    console.error('Welcome error:', err);
  }
}

async function sendGoodbye(member) {
  try {
    const channel = await member.guild.channels.fetch(GOODBYE_CHANNEL);
    if (!channel) return;

    const buffer     = await createCard(member, 'goodbye');
    const attachment = new AttachmentBuilder(buffer, { name: 'goodbye.png' });

    await channel.send({
      content: `Selamat tinggal **<@${member.id}>** 👋`,
      files:   [attachment],
    });
  } catch (err) {
    console.error('Goodbye error:', err);
  }
}

module.exports = { sendWelcome, sendGoodbye };
