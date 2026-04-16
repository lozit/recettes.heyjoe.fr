import { useState, useEffect } from 'react';

interface Ingredient {
  qty?: string;
  label: string;
}

interface Step {
  number: string;
  title?: string;
  text: string;
}

function parseIngredientsFromDOM(): Ingredient[] {
  const content = document.getElementById('recipe-content');
  if (!content) return [];

  const headings = content.querySelectorAll('h2, h3');
  const items: Ingredient[] = [];

  for (const h of headings) {
    const text = h.textContent?.toLowerCase().trim() || '';
    if (!text.includes('ingrédient') && !text.includes('ingredient')) continue;

    let sibling = h.nextElementSibling;
    while (sibling && !['H2', 'H3'].includes(sibling.tagName)) {
      if (sibling.tagName === 'UL' || sibling.tagName === 'OL') {
        const lis = sibling.querySelectorAll('li');
        for (const li of lis) {
          const raw = li.textContent?.trim() || '';
          if (!raw) continue;
          const match = raw.match(/^(\d[\d.,/\s]*\s*(?:kg|g|cl|ml|l|cs|cc|càs|càc|cac|cas|cuillère[s]?|pincée[s]?|sachet[s]?|paquet[s]?|feuille[s]?|branche[s]?|gousse[s]?|tranche[s]?|pot[s]?|verre[s]?|tasse[s]?|botte[s]?|boîte[s]?)?)\s+(.+)$/i);
          if (match) {
            items.push({ qty: match[1].trim(), label: match[2].trim() });
          } else {
            items.push({ label: raw });
          }
        }
      } else if (sibling.tagName === 'P') {
        // Handle non-list ingredients (e.g., plain text paragraphs)
        const raw = sibling.textContent?.trim() || '';
        if (raw && !raw.startsWith('*') && raw.length > 2) {
          items.push({ label: raw });
        }
      }
      sibling = sibling.nextElementSibling;
    }
  }
  return items;
}

function parseStepsFromDOM(): Step[] {
  const content = document.getElementById('recipe-content');
  if (!content) return [];

  const headings = content.querySelectorAll('h2, h3');
  const steps: Step[] = [];

  for (const h of headings) {
    const text = h.textContent?.toLowerCase().trim() || '';
    if (!text.includes('étape') && !text.includes('préparation') && !text.includes('mode opératoire')) continue;

    let sibling = h.nextElementSibling;
    while (sibling && !['H2', 'H3'].includes(sibling.tagName)) {
      if (sibling.tagName === 'OL' || sibling.tagName === 'UL') {
        const lis = sibling.querySelectorAll('li');
        for (const li of lis) {
          const num = String(steps.length + 1).padStart(2, '0');
          const strong = li.querySelector('strong');
          if (strong) {
            const title = strong.textContent?.trim() || '';
            const clone = li.cloneNode(true) as HTMLElement;
            clone.querySelector('strong')?.remove();
            const rest = clone.textContent?.trim().replace(/^[\s—–:\-]+/, '').trim() || '';
            steps.push({ number: num, title, text: rest || title });
          } else {
            steps.push({ number: num, text: li.textContent?.trim() || '' });
          }
        }
      } else if (sibling.tagName === 'P') {
        const raw = sibling.textContent?.trim() || '';
        if (raw && raw.length > 5) {
          const num = String(steps.length + 1).padStart(2, '0');
          steps.push({ number: num, text: raw });
        }
      }
      sibling = sibling.nextElementSibling;
    }
  }
  return steps;
}

export default function RecipeInteractions() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [scrollProgress, setScrollProgress] = useState(0);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure hidden content is rendered
    const timer = setTimeout(() => {
      setIngredients(parseIngredientsFromDOM());
      setSteps(parseStepsFromDOM());
      setReady(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      setScrollProgress(el.scrollHeight > el.clientHeight
        ? (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!ready) return null;

  return (
    <>
      <div className="progress-bar" style={{ width: `${scrollProgress}%` }} />

      {ingredients.length > 0 && (
        <>
          <p className="section-label">Ingrédients</p>
          <ul className="ingredients-list">
            {ingredients.map((ing, i) => (
              <li
                key={i}
                className={`ingredient-item ${checked[i] ? 'checked' : ''}`}
                onClick={() => setChecked(p => ({ ...p, [i]: !p[i] }))}
              >
                <div className="ingredient-check">
                  {checked[i] && <span className="check-icon">✓</span>}
                </div>
                <div>
                  {ing.qty && <span className="ingredient-qty">{ing.qty}</span>}
                  <span className="ingredient-label">{ing.label}</span>
                </div>
              </li>
            ))}
          </ul>
          <p className="cooking-hint">Appuie sur un ingrédient pour le cocher en cuisinant.</p>
          <div style={{ marginTop: '2.5rem' }} />
        </>
      )}

      {steps.length > 0 && (
        <>
          <p className="section-label">Préparation</p>
          <ol className="steps-list">
            {steps.map((step, i) => (
              <li
                key={i}
                className={`step-item ${completedSteps[i] ? 'done' : ''}`}
                onClick={() => setCompletedSteps(p => ({ ...p, [i]: !p[i] }))}
              >
                <span className="step-num">{step.number}</span>
                <div className="step-content">
                  {step.title ? (
                    <>
                      <div className="step-title">{step.title}<span className="done-badge">✓ fait</span></div>
                      <p className="step-text">{step.text}</p>
                    </>
                  ) : (
                    <>
                      <div className="step-title"><span className="done-badge">✓ fait</span></div>
                      <p className="step-text">{step.text}</p>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </>
      )}
    </>
  );
}
