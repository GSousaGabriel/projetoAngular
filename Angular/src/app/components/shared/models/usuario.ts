export class Usuario {
  id: string;
  type: string;

  isAdmin() {
    return this.type.toLowerCase() === 'admin';
  }
}
