import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://127.0.0.1:4567', // Porta do Sinatra
});

// Tipagem dos dados baseada no seu README
export interface Player {
  id: number;
  name: string;
  email: string;
  category: string;
  gender: string;
}

export interface Match {
  id: number;
  title: string;
  location: string;
  date: string;
  category: string;
  status: string;
  organizer_id: number;
}