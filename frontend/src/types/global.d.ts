declare global {
  interface UserInfo {
    nome: string
    email: string
    role: string
    nome_igreja: string
  }
  
  interface Aluno {
    uid: string
    nome: string
    data_nascimento: string | null
  }

  interface Classe {
    uid: string
    nome: string
  }
  
  interface Congregacao {
    uid: string
    nome: string
  }
  
  interface Periodo {
    uid: string
    ano: string
    periodo: string
    concluido: boolean
  }
}

export { }

