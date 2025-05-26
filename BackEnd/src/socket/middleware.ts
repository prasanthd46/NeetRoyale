import { Server as IOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';
import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

const auth0Domain = process.env.AUTH0_DOMAIN; 
const auth0Audience = process.env.AUTH0_AUDIENCE;

const client = jwksClient({
  jwksUri: `https://${auth0Domain}/.well-known/jwks.json`,
  cache: true,
  rateLimit: true,
});

function getKey(header: any, callback: any) {
  console.log("🔑 Fetching JWKS key for:", header.kid);
  client.getSigningKey(header.kid, function (err, key) {
    if (err) return callback(err, null);
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

export function initSocket(server: http.Server) {
  const io = new IOServer(server, {
      cors: {
      origin: "http://localhost:5173", 
      credentials: true,
    },transports: ['websocket'],
     
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Auth token missing'));
    console.log("here")
    jwt.verify(
      token,
      getKey,
      {
        audience: auth0Audience,
        issuer: `https://${process.env.AUTH0_DOMAIN}/`,
        algorithms: ['RS256'],
      },
      (err, decoded) => {
        if (err) return next(new Error('Invalid token'));
        socket.data.user = decoded; 
        console.log("ikkade unna")
        next();
      }
    );
  });
  return io;
}