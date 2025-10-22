// lib/net.ts (server-only bootstrap)
import dns from "node:dns";
import { Agent, setGlobalDispatcher } from "undici";
// Prefer IPv4 in DNS results
dns.setDefaultResultOrder("ipv4first");
// Force IPv4 sockets by overriding lookup
const ipv4Agent = new Agent({
    connect: {
        lookup: (hostname, options, cb) => dns.lookup(hostname, { ...options, family: 4 }, cb),
    },
});
setGlobalDispatcher(ipv4Agent);
console.log("🌐 Forcing IPv4 for fetch");
