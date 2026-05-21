// amiConnection.js
import Ami from "asterisk-ami";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config();

// Crée l'instance AMI
const ami = new Ami({
  host: process.env.ASTERISK_HOST || "127.0.0.1",
  port: Number(process.env.ASTERISK_PORT) || 5038,
  username: process.env.ASTERISK_USER || "agent",
  password: process.env.ASTERISK_PASSWORD || "123456",
  reconnect: true,
  keepAlive: true,
});

// === Gestion des événements AMI ===
ami.on("connect", () => console.log(chalk.green("✅ Connected to Asterisk AMI")));
ami.on("disconnect", () => console.log(chalk.yellow("⚠️ Disconnected from AMI")));
ami.on("error", (err) => console.error(chalk.red("❌ AMI Error:"), err));
ami.on("event", (event) => console.log(chalk.blue("📨 AMI Event:"), event));

// === Fonctions utilitaires ===
export async function pingAmi() {
  try {
    const res = await ami.send({ Action: "Ping" });
    console.log(chalk.green("Ping OK:"), res);
  } catch (err) {
    console.error(chalk.red("Ping FAIL:"), err);
  }
}

export async function originateCall({ fromExt, toExt, context = "internal", callerId = "NodeAMI" }) {
  try {
    const res = await ami.send({
      Action: "Originate",
      Channel: `PJSIP/${fromExt}`,
      Context: context,
      Exten: toExt,
      Priority: 1,
      CallerID: callerId,
      Async: true,
    });
    console.log(chalk.green(`Originate OK from ${fromExt} to ${toExt}:`), res);
  } catch (err) {
    console.error(chalk.red(`Originate FAIL from ${fromExt} to ${toExt}:`), err);
  }
}

// Exporter l’instance pour réutiliser dans server.js
export default ami;