
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { UserData } from '../services/userService';
import { auth, db } from './firebase';

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  userData?: UserData;
}

export class FirebaseService {
  private static listeners: Array<() => void> = [];

  // Escutar mudanças no estado de autenticação
  static onAuthStateChanged(callback: (user: FirebaseUser | null) => void): () => void {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        try {
          // Buscar dados adicionais do usuário no Firestore
          const userData = await this.getUserData(user.uid);
          
          const firebaseUser: FirebaseUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
            userData: userData || undefined
          };
          
          callback(firebaseUser);
        } catch (error) {
          console.error('Erro ao carregar dados do usuário:', error);
          // Retornar usuário básico mesmo se houver erro
          const firebaseUser: FirebaseUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified
          };
          callback(firebaseUser);
        }
      } else {
        callback(null);
      }
    });

    // Armazenar listener para cleanup
    this.listeners.push(unsubscribe);
    return unsubscribe;
  }

  // Buscar dados do usuário no Firestore
  static async getUserData(uid: string): Promise<UserData | null> {
    try {
      const userDoc = await getDoc(doc(db, 'usuarios', uid));
      if (userDoc.exists()) {
        return {
          uid: userDoc.id,
          ...userDoc.data()
        } as UserData;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }
  }

  // Verificar se usuário está autenticado
  static isAuthenticated(): boolean {
    return auth.currentUser !== null;
  }

  // Obter usuário atual
  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  // Obter UID do usuário atual
  static getCurrentUserId(): string | null {
    return auth.currentUser?.uid || null;
  }

  // Verificar se usuário é admin
  static async isAdmin(uid?: string): Promise<boolean> {
    try {
      const userId = uid || this.getCurrentUserId();
      if (!userId) return false;

      const userData = await this.getUserData(userId);
      return userData?.tipo === 'admin';
    } catch (error) {
      console.error('Erro ao verificar se é admin:', error);
      return false;
    }
  }

  // Verificar se usuário é cliente
  static async isCliente(uid?: string): Promise<boolean> {
    try {
      const userId = uid || this.getCurrentUserId();
      if (!userId) return false;

      const userData = await this.getUserData(userId);
      return userData?.tipo === 'cliente';
    } catch (error) {
      console.error('Erro ao verificar se é cliente:', error);
      return false;
    }
  }

  // Limpar todos os listeners
  static cleanup(): void {
    this.listeners.forEach(unsubscribe => unsubscribe());
    this.listeners = [];
  }

  // Verificar conexão com Firebase
  static async checkConnection(): Promise<boolean> {
    try {
      // Tentar fazer uma operação simples
      await getDoc(doc(db, 'usuarios', 'test'));
      return true;
    } catch (error) {
      console.error('Erro de conexão com Firebase:', error);
      return false;
    }
  }

  // Obter informações do usuário atual de forma síncrona
  static getCurrentUserInfo(): FirebaseUser | null {
    const user = this.getCurrentUser();
    if (!user) return null;

    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
  }

  // Aguardar autenticação inicial
  static async waitForAuth(): Promise<FirebaseUser | null> {
    return new Promise((resolve) => {
      const unsubscribe = this.onAuthStateChanged((user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }
}
