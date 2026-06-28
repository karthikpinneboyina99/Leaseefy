import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const coverPagePath = path.join(process.cwd(), '../templates/Mutual-NDA/Mutual-NDA-coverpage.md');
    const termsPath = path.join(process.cwd(), '../templates/Mutual-NDA/Mutual-NDA.md');
    
    const coverPage = fs.readFileSync(coverPagePath, 'utf8');
    const terms = fs.readFileSync(termsPath, 'utf8');

    return NextResponse.json({ coverPage, terms });
  } catch (error) {
    console.error('Error reading templates:', error);
    return NextResponse.json({ error: 'Failed to load templates' }, { status: 500 });
  }
}
