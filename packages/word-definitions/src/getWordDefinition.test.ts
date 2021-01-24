import { parseHtml } from './getWordDefinition';

describe('getWordDefinition', () => {
  it('Extracts definitions', () => {
    const html = `<h2><span id=\"English\">English</span></h2>\n<h3><span id=\"Etymology\">Etymology</span></h3>\n<p>From <span>Latin</span> <i class=\"Latn mention\" lang=\"la\">p\u014dmum</i> <span>(</span><span>\u201c</span><span>fruit</span><span>\u201d</span><span>)</span> and <i class=\"Latn mention\" lang=\"en\">-ology</i>.\n</p>\n<h3><span id=\"Noun\">Noun</span></h3>\n<p><strong class=\"Latn headword\" lang=\"en\">pomology</strong> (<i>usually uncountable</i>, <i>plural</i> <b class=\"Latn form-of lang-en p-form-of\" lang=\"en\">pomologies</b>)\n</p>\n<ol><li><span>(</span><span>botany</span><span>)</span> The study of pome fruit and of the cultivation of such fruit.</li>\n<li><span>(</span><span>botany</span><span>)</span> The study of fruit in general and of the cultivation of fruit.</li>\n<li>A work or treatise written on this subject.</li></ol><h4><span id=\"Related_terms\">Related terms</span></h4>\n<ul><li><span lang=\"en\">pomological</span></li>\n<li><span lang=\"en\">pomologist</span></li></ul><h4><span id=\"Coordinate_terms\">Coordinate terms</span></h4>\n<ul><li><span lang=\"en\">fruticulture</span></li></ul><h4><span id=\"Translations\">Translations</span></h4>\n<h3><span id=\"Further_reading\">Further reading</span></h3>\n<ul><li> <b class=\"Latn\" lang=\"en\">pomology</b> on  Wikipedia.<span>Wikipedia </span></li></ul>`;
    const result = parseHtml(html, 'pomology');

    expect(result).toEqual({
      definitions: [
        '(botany) The study of pome fruit and of the cultivation of such fruit.',
        '(botany) The study of fruit in general and of the cultivation of fruit.',
        'A work or treatise written on this subject.',
      ],
      isAllowed: true,
      word: 'pomology',
    });
  });

  it('Detects misspelled words', () => {
    const html = `<h2><span id=\"English\">English</span></h2>\n<h3><span id=\"Numeral\">Numeral</span></h3>\n<p><strong class=\"Latn headword\" lang=\"en\">fourty</strong>\n</p>\n<ol><li><span>Obsolete spelling of <span><i class=\"Latn mention\" lang=\"en\">forty</i></span></span>\n<ul><li><b>1719\u20141762</b> (published <b>1908</b>): George Waldo Browne (editor), <i>Early Records of Londonderry, Windham, and Derry, N. H.</i>\n<dl><dd>[I]<i>t is also voted and hereby to be understood that we have concluded to pay yearly or per annum one hundred and <b>fourty</b> pounds Salary</i><span> </span><span>[</span>\u2026<span>]</span><span> </span></dd></dl></li></ul></li>\n<li><span>Misspelling of <span><i class=\"Latn mention\" lang=\"en\">forty</i></span></span>.\n<ul><li></ul></li></ol>`;
    const result = parseHtml(html, 'fourty');

    expect(result).toEqual({
      definitions: [],
      isAllowed: false,
      word: 'fourty',
    });
  });
});
