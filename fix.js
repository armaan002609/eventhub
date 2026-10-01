const fs = require('fs');
let s = fs.readFileSync('prisma/schema.prisma', 'utf8');
s = s.replace(/@relation\(\\\r?\nChatSent\\,/g, '@relation("ChatSent",');
s = s.replace(/@relation\(\\ChatReceived\\,/g, '@relation("ChatReceived",');
fs.writeFileSync('prisma/schema.prisma', s);
