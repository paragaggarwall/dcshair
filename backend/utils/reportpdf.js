const PDFDocument = require('pdfkit');

// ─── Constants ────────────────────────────────────────────────────────────────

const A4_W = 841.89;   // pts  (210 mm)841.89
const A4_H = 595.28;   // pts  (297 mm)

const MARGIN = 10;   // outer page margin (pts)
const BANNER_H = 60;   // company-name banner height
const BOX_SIZE = 120;  // each square box side length (pts)
const BOX_GAP = 20;   // gap between boxes (horizontal & vertical)
const BOX_HEADING_H = 30;   // height of the heading sub-row inside each box
const HEADING_FONT_SZ = 9;
const VALUE_FONT_SZ = 13;
const COMPANY_FONT_SZ = 22;
//const BANNER_BG = '#1a1a2e';   // dark navy
const BANNER_FG = '#000000';
const BOX_BORDER = '#333333';
const BOX_HEADING_BG = '#f0f0f0';
const BOX_VALUE_BG = '#ffffff';

// ─── Main Export ──────────────────────────────────────────────────────────────


function generateBoxLabel({ companyName = 'DCS HAIR', boxes = [] }) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0, autoFirstPage: true });

        const chunks = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // ── 1. Company Banner ──────────────────────────────────────────────────
        doc
            .rect(0, 0, A4_W, BANNER_H)
            .stroke('#333333');

        doc
            .fillColor(BANNER_FG)
            .fontSize(COMPANY_FONT_SZ)
            .font('Helvetica-Bold')
            .text(companyName, 0, (BANNER_H - COMPANY_FONT_SZ) / 2, {
                width: A4_W,
                align: 'center',
            });

        // ── 2. Calculate grid layout ───────────────────────────────────────────
        const usableW = A4_W - MARGIN * 2;

        // How many boxes fit in one row?
        // boxes_per_row * BOX_SIZE + (boxes_per_row - 1) * BOX_GAP <= usableW
        const maxPerRow = Math.floor((usableW + BOX_GAP) / (BOX_SIZE + BOX_GAP));
        const perRow = Math.min(maxPerRow, boxes.length || 1);

        // Total width taken by one row of `perRow` boxes
        const rowW = perRow * BOX_SIZE + (perRow - 1) * BOX_GAP;

        // Start X so the row block is horizontally centred
        const startX = (A4_W - rowW) / 2;

        // Start Y — just below the banner with a gap
        const startY = BANNER_H + BOX_GAP * 2;

        // ── 3. Draw each box ───────────────────────────────────────────────────
        boxes.forEach((box, idx) => {
            const col = idx % perRow;
            const row = Math.floor(idx / perRow);

            const x = startX + col * (BOX_SIZE + BOX_GAP);
            const y = startY + row * (BOX_SIZE + BOX_GAP);

            drawBox(doc, x, y, BOX_SIZE, box.heading, box.value);
        });

        doc.end();
    });
}

// ─── Helper: draw a single box ────────────────────────────────────────────────

function drawBox(doc, x, y, size, heading, value) {
    const headingH = BOX_HEADING_H;
    const valueH = size - headingH;

    // Heading row background
    doc
        .rect(x, y, size, headingH)
        .fillAndStroke(BOX_HEADING_BG, BOX_BORDER);

    // Value row background
    doc
        .rect(x, y + headingH, size, valueH)
        .fillAndStroke(BOX_VALUE_BG, BOX_BORDER);

    // Heading text
    doc
        .fillColor('#555555')
        .fontSize(HEADING_FONT_SZ)
        .font('Helvetica-Bold')
        .text(heading, x + 4, y + (headingH - HEADING_FONT_SZ) / 2 + 1, {
            width: size - 8,
            align: 'center',
            lineBreak: false,
            ellipsis: true,
        });

    // Value text (vertically centred in the value row)
    doc
        .fillColor('#111111')
        .fontSize(VALUE_FONT_SZ)
        .font('Helvetica-Bold')
        .text(value, x + 4, y + headingH + (valueH - VALUE_FONT_SZ) / 2, {
            width: size - 8,
            align: 'center',
            lineBreak: false,
            ellipsis: true,
        });
}

module.exports = { generateBoxLabel };

// ─── Smoke Test (run directly: node reportpdf.js) ─────────────────────────────
if (require.main === module) {
    const fs = require('fs');

    const test = [
        {
            name: 'landscape test',
            data: {
                companyName: 'DCS HAIR',
                boxes: [
                    { heading: 'heading', value: 'val' },
                    { heading: 'heading', value: 'val' },
                    { heading: 'heading', value: 'val' },
                    { heading: 'heading', value: 'val' },
                    { heading: 'heading', value: 'val' },
                    { heading: 'heading', value: 'val' },
                    { heading: 'heading', value: 'val' },
                    { heading: 'heading', value: 'val' },
                    { heading: 'heading', value: 'val' },
                    { heading: 'heading', value: 'val' }
                ],
            },
        },
    ];

    (async () => {
        console.log('\nRunning smoke tests...\n');
        for (const t of test) {
            try {
                const buf = await generateBoxLabel(t.data);
                fs.writeFileSync(`smoke_${t.name}.pdf`, buf);
                console.log(`✅  smoke_${t.name}.pdf`);
            } catch (err) {
                console.error(`❌  ${t.name} — ${err.message}`);
            }
        }
        console.log('\nDone.\n');
    })();
}