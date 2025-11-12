// config/passport.js
// -------------------- CONFIGURACIÓN DE PASSPORT --------------------
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UsuarioModel from '../models/UsuarioModel.js';

// -------------------- ESTRATEGIA LOCAL (Para sesiones web) --------------------
passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const usuario = await UsuarioModel.getByEmail(email);
        
        if (!usuario) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }

        if (!usuario.activo) {
          return done(null, false, { message: 'Usuario inactivo' });
        }

        if (usuario.isBlocked()) {
          return done(null, false, { 
            message: `Usuario bloqueado hasta ${usuario.bloqueadoHasta.toLocaleString()}` 
          });
        }

        const isMatch = await usuario.comparePassword(password);
        
        if (!isMatch) {
          await usuario.incrementFailedAttempts();
          return done(null, false, { message: 'Contraseña incorrecta' });
        }

        // Contraseña correcta, resetear intentos fallidos
        await usuario.resetFailedAttempts();
        await usuario.updateLastAccess();

        return done(null, usuario);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// -------------------- ESTRATEGIA JWT (Para API) --------------------
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'tu-secret-key-cambiar-en-produccion'
};

passport.use(
  'jwt',
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const usuario = await UsuarioModel.getById(payload.id);
      
      if (!usuario) {
        return done(null, false);
      }

      if (!usuario.activo) {
        return done(null, false, { message: 'Usuario inactivo' });
      }

      if (usuario.isBlocked()) {
        return done(null, false, { message: 'Usuario bloqueado' });
      }

      return done(null, usuario);
    } catch (error) {
      return done(error);
    }
  })
);

// -------------------- SERIALIZACIÓN PARA SESIONES --------------------
passport.serializeUser((usuario, done) => {
  done(null, usuario._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const usuario = await UsuarioModel.getById(id);
    done(null, usuario);
  } catch (error) {
    done(error);
  }
});

export default passport;

