import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface UserData {
  uid: string;
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
  tipo: 'cliente' | 'admin';
  criadoEm: Date;
  atualizadoEm?: Date;
  avatar?: string;
  observacoes?: string;
}

export class UserService {
  // Buscar dados do usuário pelo UID
  static async getUserData(uid: string): Promise<UserData | null> {
    try {
      const userDoc = await getDoc(doc(db, 'usuarios', uid));
      if (userDoc.exists()) {
        return { uid, ...userDoc.data() } as UserData;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }
  }

  // Criar novo usuário
  static async createUser(userData: Omit<UserData, 'uid' | 'criadoEm'>): Promise<boolean> {
    try {
      const userRef = doc(db, 'usuarios', userData.email.replace('@', '_').replace('.', '_'));
      await setDoc(userRef, {
        ...userData,
        criadoEm: new Date(),
        atualizadoEm: new Date()
      });
      return true;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return false;
    }
  }

  // Atualizar dados do usuário
  static async updateUser(uid: string, userData: Partial<UserData>): Promise<boolean> {
    try {
      const userRef = doc(db, 'usuarios', uid);
      await updateDoc(userRef, {
        ...userData,
        atualizadoEm: new Date()
      });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      return false;
    }
  }

  // Buscar usuário por email
  static async getUserByEmail(email: string): Promise<UserData | null> {
    try {
      const q = query(collection(db, 'usuarios'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { uid: doc.id, ...doc.data() } as UserData;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      return null;
    }
  }

  // Listar todos os usuários (para admin)
  static async getAllUsers(): Promise<UserData[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'usuarios'));
      return querySnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as UserData[];
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      return [];
    }
  }

  // Listar apenas clientes
  static async getClientes(): Promise<UserData[]> {
    try {
      const q = query(collection(db, 'usuarios'), where('tipo', '==', 'cliente'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as UserData[];
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      return [];
    }
  }

  // Verificar se usuário é admin
  static async isAdmin(uid: string): Promise<boolean> {
    try {
      const userData = await this.getUserData(uid);
      return userData?.tipo === 'admin';
    } catch (error) {
      console.error('Erro ao verificar se é admin:', error);
      return false;
    }
  }
}
