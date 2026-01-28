import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import './IdeaCard.css';

/**
 * Render KaTeX math expressions in text
 * Finds $...$ patterns and renders them as math
 */
function renderMathInText(text, containerRef) {
  if (!text || !containerRef.current) return;

  // Split text by $ delimiters
  const parts = text.split(/(\$[^$]+\$)/g);
  containerRef.current.innerHTML = '';

  parts.forEach(part => {
    if (part.startsWith('$') && part.endsWith('$')) {
      // Math expression
      let mathContent = part.slice(1, -1);

      // Fix common escaping issues that occur when parsing LLM JSON output or JS template literals
      // e.g. \times is often mangled to a tab character (\t), \frac to form feed (\f)
      mathContent = mathContent
        .replace(/\t/g, '\\times')
        .replace(/\f/g, '\\frac')
        .replace(/\n/g, '\\\\')
        .replace(/&nbsp;/g, ' ');

      const mathSpan = document.createElement('span');
      mathSpan.className = 'math-inline';
      try {
        katex.render(mathContent, mathSpan, {
          throwOnError: false,
          displayMode: false,
          trust: true
        });
      } catch (e) {
        mathSpan.textContent = mathContent;
      }
      containerRef.current.appendChild(mathSpan);
    } else if (part) {
      // Regular text
      const textNode = document.createTextNode(part);
      containerRef.current.appendChild(textNode);
    }
  });
}

/**
 * Component to render text with KaTeX math
 */
function MathText({ text }) {
  const containerRef = useRef(null);

  useEffect(() => {
    renderMathInText(text, containerRef);
  }, [text]);

  return <span ref={containerRef}>{text}</span>;
}

export function IdeaCard({ idea, context }) {
  const hasStructuredContent = !!idea.situation;

  return (
    <div className="idea-card">
      <div className="idea-header">
        <h3 className="idea-title">
          <MathText text={idea.title} />
        </h3>
      </div>

      {/* Structured content format */}
      {hasStructuredContent ? (
        <div className="idea-section situation-section">
          <p className="section-content">
            <MathText text={idea.situation} />
          </p>
        </div>
      ) : (
        /* Legacy format fallback */
        <div className="idea-scenario">
          <h4>Real-World Usage:</h4>
          <p><MathText text={idea.scenario} /></p>
        </div>
      )}
    </div>
  );
}
