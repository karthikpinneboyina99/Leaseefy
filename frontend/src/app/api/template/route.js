import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const localPath = searchParams.get('path');

  if (!localPath) {
    return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 });
  }

  try {
    const rootDir = process.cwd(); // Note: cwd is 'frontend'
    const fullDirPath = path.join(rootDir, '..', localPath);

    if (!fs.existsSync(fullDirPath)) {
      return NextResponse.json({ error: 'Template directory not found' }, { status: 404 });
    }

    const files = fs.readdirSync(fullDirPath);

    // Find the Cover Page
    const coverPageFile = files.find(file => file.toLowerCase().includes('coverpage') && file.endsWith('.md'));
    
    // Find the Standard Terms (ignore README and Cover Page)
    const standardTermsFile = files.find(file => 
      file.endsWith('.md') && 
      file.toLowerCase() !== 'readme.md' && 
      !file.toLowerCase().includes('coverpage')
    );

    let coverPage = '';
    let standardTerms = '';

    if (coverPageFile) {
      coverPage = fs.readFileSync(path.join(fullDirPath, coverPageFile), 'utf8');
    }
    
    if (standardTermsFile) {
      standardTerms = fs.readFileSync(path.join(fullDirPath, standardTermsFile), 'utf8');
    }

    // If there is no explicit cover page, treat the standard terms as the primary template (fallback)
    if (!coverPage && standardTerms) {
      coverPage = standardTerms;
      standardTerms = '';
    }

    return NextResponse.json({ coverPage, standardTerms });
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
