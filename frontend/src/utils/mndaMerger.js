export function mergeMNDA(coverPage, terms, formData) {
  let merged = coverPage;
  let finalTerms = terms;

  // Helper to replace only if value is provided
  const replace = (target, value) => {
    if (value && value.trim() !== '') {
      merged = merged.replace(target, `**${value}**`);
    }
  };

  replace('[Evaluating whether to enter into a business relationship with the other party.]', formData.purpose);
  replace('[Today’s date]', formData.effectiveDate);
  replace('[Fill in state]', formData.governingLaw);
  replace('[Fill in city or county and state, i.e. “courts located in New Castle, DE”]', formData.jurisdiction);

  merged = merged.replace(/- \[x\]/g, '- [ ]');

  if (['1 year', '2 years', '3 years'].includes(formData.mndaTerm)) {
    merged = merged.replace('- [ ]     Expires [1 year(s)] from Effective Date.', `- [x]     Expires **${formData.mndaTerm}** from Effective Date.`);
  } else if (formData.mndaTerm === 'Continues until terminated') {
    merged = merged.replace('- [ ]     Continues until terminated in accordance with the terms of the MNDA.', '- [x]     Continues until terminated in accordance with the terms of the MNDA.');
  }

  if (['1 year', '2 years', '3 years'].includes(formData.termOfConfidentiality)) {
    merged = merged.replace('- [ ]     [1 year(s)] from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.', `- [x]     **${formData.termOfConfidentiality}** from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.`);
  } else if (formData.termOfConfidentiality === 'In perpetuity') {
    merged = merged.replace('- [ ]     In perpetuity.', '- [x]     In perpetuity.');
  }

  const p1 = formData.party1 || {};
  const p2 = formData.party2 || {};

  const sig1 = p1.signature ? `![Party 1 Signature](${p1.signature})` : ' ';
  const sig2 = p2.signature ? `![Party 2 Signature](${p2.signature})` : ' ';

  const sigRow = `| Signature | ${sig1} | ${sig2} |`;
  const nameRow = `| Print Name | ${p1.name ? `**${p1.name}**` : ''} | ${p2.name ? `**${p2.name}**` : ''} |`;
  const titleRow = `| Title | ${p1.title ? `**${p1.title}**` : ''} | ${p2.title ? `**${p2.title}**` : ''} |`;
  const companyRow = `| Company | ${p1.company ? `**${p1.company}**` : ''} | ${p2.company ? `**${p2.company}**` : ''} |`;
  const addressRow = `| Notice Address <label>Use either email or postal address</label> | ${p1.address ? `**${p1.address}**` : ''} | ${p2.address ? `**${p2.address}**` : ''} |`;
  const dateRow = `| Date | ${p1.date ? `**${p1.date}**` : ''} | ${p2.date ? `**${p2.date}**` : ''} |`;

  merged = merged.replace('| Signature | | |', sigRow);
  merged = merged.replace('| Print Name | |', nameRow);
  merged = merged.replace('| Title | | |', titleRow);
  merged = merged.replace('| Company | | |', companyRow);
  merged = merged.replace('| Notice Address <label>Use either email or postal address</label> | | |', addressRow);
  merged = merged.replace('| Date | | |', dateRow);

  merged = merged.replace(/<\/?label[^>]*>/g, '');
  merged = merged.replace(/<\/?span[^>]*>/g, '');
  finalTerms = finalTerms.replace(/<\/?span[^>]*>/g, '');

  return `${merged}\n\n---\n\n${finalTerms}`;
}
