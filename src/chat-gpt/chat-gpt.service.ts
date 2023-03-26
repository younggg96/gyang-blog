import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ChatGptService {
  apiKey: string;
  constructor(private config: ConfigService) {
    this.apiKey = this.config.get('CHATGPT_API_KEY');
  }

  async recommendText(inputText: string): Promise<string> {
    const apiUrl = 'https://api.chatgpt.com/recommend';
    const headers = {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
    console.log(this.apiKey);
    const response = await axios.post(
      apiUrl,
      {
        text: inputText,
      },
      { headers },
    );

    return response.data.recommendation;
  }

  findAll() {
    return `This action returns all chatGpt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatGpt`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatGpt`;
  }
}
