// const PDFDocument = require('pdfkit');

// // ─── Constants ────────────────────────────────────────────────────────────────

// const A4_W = 841.89;   // pts  (210 mm)841.89
// const A4_H = 595.28;   // pts  (297 mm)

// const MARGIN = 10;   // outer page margin (pts)
// const BANNER_H = 60;   // company-name banner height
// const BOX_SIZE = 120;  // each square box side length (pts)
// const BOX_GAP = 20;   // gap between boxes (horizontal & vertical)
// const BOX_HEADING_H = 30;   // height of the heading sub-row inside each box
// const HEADING_FONT_SZ = 9;
// const VALUE_FONT_SZ = 13;
// const COMPANY_FONT_SZ = 22;
// //const BANNER_BG = '#1a1a2e';   // dark navy
// const BANNER_FG = '#000000';
// const BOX_BORDER = '#333333';
// const BOX_HEADING_BG = '#f0f0f0';
// const BOX_VALUE_BG = '#ffffff';

// // ─── Main Export ──────────────────────────────────────────────────────────────


// function generateBoxLabel({ companyName = 'DCS HAIR', boxes = [] }) {
//     return new Promise((resolve, reject) => {
//         const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0, autoFirstPage: true });

//         const chunks = [];
//         doc.on('data', (chunk) => chunks.push(chunk));
//         doc.on('end', () => resolve(Buffer.concat(chunks)));
//         doc.on('error', reject);

//         // ── 1. Company Banner ──────────────────────────────────────────────────
//         doc
//             .rect(0, 0, A4_W, BANNER_H)
//             .stroke('#333333');

//         doc
//             .fillColor(BANNER_FG)
//             .fontSize(COMPANY_FONT_SZ)
//             .font('Helvetica-Bold')
//             .text(companyName, 0, (BANNER_H - COMPANY_FONT_SZ) / 2, {
//                 width: A4_W,
//                 align: 'center',
//             });

//         // ── 2. Calculate grid layout ───────────────────────────────────────────
//         const usableW = A4_W - MARGIN * 2;

//         // How many boxes fit in one row?
//         // boxes_per_row * BOX_SIZE + (boxes_per_row - 1) * BOX_GAP <= usableW
//         const maxPerRow = Math.floor((usableW + BOX_GAP) / (BOX_SIZE + BOX_GAP));
//         const perRow = Math.min(maxPerRow, boxes.length || 1);

//         // Total width taken by one row of `perRow` boxes
//         const rowW = perRow * BOX_SIZE + (perRow - 1) * BOX_GAP;

//         // Start X so the row block is horizontally centred
//         const startX = (A4_W - rowW) / 2;

//         // Start Y — just below the banner with a gap
//         const startY = BANNER_H + BOX_GAP * 2;

//         // ── 3. Draw each box ───────────────────────────────────────────────────
//         boxes.forEach((box, idx) => {
//             const col = idx % perRow;
//             const row = Math.floor(idx / perRow);

//             const x = startX + col * (BOX_SIZE + BOX_GAP);
//             const y = startY + row * (BOX_SIZE + BOX_GAP);

//             drawBox(doc, x, y, BOX_SIZE, box.heading, box.value);
//         });

//         doc.end();
//     });
// }

// // ─── Helper: draw a single box ────────────────────────────────────────────────

// function drawBox(doc, x, y, size, heading, value) {
//     const headingH = BOX_HEADING_H;
//     const valueH = size - headingH;

//     // Heading row background
//     doc
//         .rect(x, y, size, headingH)
//         .fillAndStroke(BOX_HEADING_BG, BOX_BORDER);

//     // Value row background
//     doc
//         .rect(x, y + headingH, size, valueH)
//         .fillAndStroke(BOX_VALUE_BG, BOX_BORDER);

//     // Heading text
//     doc
//         .fillColor('#555555')
//         .fontSize(HEADING_FONT_SZ)
//         .font('Helvetica-Bold')
//         .text(heading, x + 4, y + (headingH - HEADING_FONT_SZ) / 2 + 1, {
//             width: size - 8,
//             align: 'center',
//             lineBreak: false,
//             ellipsis: true,
//         });

//     // Value text (vertically centred in the value row)
//     doc
//         .fillColor('#111111')
//         .fontSize(VALUE_FONT_SZ)
//         .font('Helvetica-Bold')
//         .text(value, x + 4, y + headingH + (valueH - VALUE_FONT_SZ) / 2, {
//             width: size - 8,
//             align: 'center',
//             lineBreak: false,
//             ellipsis: true,
//         });
// }

// module.exports = { generateBoxLabel };

// // ─── Smoke Test (run directly: node reportpdf.js) ─────────────────────────────
// if (require.main === module) {
//     const fs = require('fs');

//     const test = [
//         {
//             name: 'landscape test',
//             data: {
//                 companyName: 'DCS HAIR',
//                 boxes: [
//                     { heading: 'heading', value: 'val' },
//                     { heading: 'heading', value: 'val' },
//                     { heading: 'heading', value: 'val' },
//                     { heading: 'heading', value: 'val' },
//                     { heading: 'heading', value: 'val' },
//                     { heading: 'heading', value: 'val' },
//                     { heading: 'heading', value: 'val' },
//                     { heading: 'heading', value: 'val' },
//                     { heading: 'heading', value: 'val' },
//                     { heading: 'heading', value: 'val' }
//                 ],
//             },
//         },
//     ];

//     (async () => {
//         console.log('\nRunning smoke tests...\n');
//         for (const t of test) {
//             try {
//                 const buf = await generateBoxLabel(t.data);
//                 fs.writeFileSync(`smoke_${t.name}.pdf`, buf);
//                 console.log(`✅  smoke_${t.name}.pdf`);
//             } catch (err) {
//                 console.error(`❌  ${t.name} — ${err.message}`);
//             }
//         }
//         console.log('\nDone.\n');
//     })();
// }




const PDFDocument = require('pdfkit');

// ─── Page Constants ────────────────────────────────────────────────────────────
const PW = 841.89;   // A4 landscape width
const PH = 595.28;   // A4 landscape height
const ML = 15;       // left margin
const MR = 15;       // right margin
const CONTENT_W = PW - ML - MR;  // 811.89

// ─── Heights ───────────────────────────────────────────────────────────────────
const COMPANY_BLOCK_H = 75;   // top company header
const SECTION_LABEL_H = 20;   // "EXPORT (SIZE // RATE WISE) SALES" row
const COL_HDR_H = 28;   // 6-column header row (2 lines: Sr.No.)
const INFO_ROW_H = 25;   // per-invoice info row
const SIZE_ROW_H = 28;   // size boxes row (label on top, value below)
const TOTAL_ROW_H = 15;   // Total row

// ─── Font Sizes ────────────────────────────────────────────────────────────────
const FS_COMPANY = 16;
const FS_ADDRESS = 8;
const FS_DATE = 8;
const FS_SECTION = 9;
const FS_COL_HDR = 8;
const FS_INFO = 8;
const FS_SIZE_LBL = 7;
const FS_SIZE_VAL = 7;
const FS_TOTAL = 8;

// ─── Sizes ─────────────────────────────────────────────────────────────────────
const SIZES = ['4"', '6"', '7"', '8"', '9"', '10"', '12"', '14"', '16"', '18"', '20"', '22"', '24"', '26"', '28"', '30"', '32"'];

// ─── Column widths for the 6-column info row ───────────────────────────────────
// Sr | Invoice | LC | Buyer | Amount | AWB
const C_SR = 20;
const C_INV = 110;
const C_LC = 100;
const C_BUYER = 290;
const C_AMT = 80;
const C_AWB = CONTENT_W - C_SR - C_INV - C_LC - C_BUYER - C_AMT; // ~304

// ─── Helpers ───────────────────────────────────────────────────────────────────
function rect(doc, x, y, w, h, fill, strokeColor) {
    if (fill) {
        doc.rect(x, y, w, h).fillAndStroke(fill, strokeColor || '#000000');
    } else {
        doc.rect(x, y, w, h).stroke(strokeColor || '#000000');
    }
}

function txt(doc, text, x, y, w, h, opts = {}) {
    const { align = 'left', bold = false, size = 8, color = '#000000', pad = 3 } = opts;
    doc.font(bold ? 'Helvetica-Bold' : 'Helvetica')
        .fontSize(size)
        .fillColor(color);
    const ty = y + Math.max(0, (h - size) / 2);
    doc.text(String(text ?? ''), x + pad, ty, {
        width: Math.max(1, w - pad * 2),
        align,
        lineBreak: false,
        ellipsis: true,
    });
}

// ─── Draw company header (top of every page) ───────────────────────────────────
function drawCompanyHeader(doc, meta, y) {
    // Outer border
    rect(doc, ML, y, CONTENT_W, COMPANY_BLOCK_H, '#ffffff', '#000000');

    const companyY = y + 18;
    const addressY = companyY + 22;

    doc.font('Helvetica-Bold')
        .fontSize(FS_COMPANY)
        .fillColor('#000000')
        .text(meta.companyName, ML, companyY, {
            width: CONTENT_W,
            align: 'center'
        });

    doc.font('Helvetica-Bold')
        .fontSize(FS_ADDRESS)
        .fillColor('#000000')
        .text(meta.address, ML, addressY, {
            width: CONTENT_W,
            align: 'center'
        });

    // Date range — bottom right
    const dateText = `FROM: ${meta.from}  TO : ${meta.to}`;
    doc.font('Helvetica-Bold').fontSize(FS_DATE).fillColor('#000000')
        .text(dateText, ML, y + COMPANY_BLOCK_H - FS_DATE - 6, {
            width: CONTENT_W - 8,
            align: 'right',
            lineBreak: false,
        });

    return y + COMPANY_BLOCK_H;
}

// ─── Draw section header (repeats on every page after company block) ───────────
function drawSectionHeader(doc, y) {
    // Row 1: "EXPORT (SIZE // RATE WISE) SALES"
    rect(doc, ML, y, CONTENT_W, SECTION_LABEL_H, '#d9d9d9', '#000000');
    txt(doc, 'EXPORT (SIZE // RATE WISE) SALES', ML, y, CONTENT_W, SECTION_LABEL_H,
        { bold: true, size: FS_SECTION, align: 'left', pad: 5 });
    y += SECTION_LABEL_H;

    // Row 2: 6 column headers
    const cols = [
        { label: 'Sr.\nNo.', w: C_SR },
        { label: 'Invoice No. & Date', w: C_INV },
        { label: 'LC No. & Date', w: C_LC },
        { label: 'Buyer Name & Country', w: C_BUYER },
        { label: 'Amount', w: C_AMT },
        { label: 'B/L - AWB No. & Date', w: C_AWB },
    ];

    let cx = ML;
    for (const col of cols) {
        rect(doc, cx, y, col.w, COL_HDR_H, '#d9d9d9', '#000000');

        if (col.label.includes('\n')) {
            const [l1, l2] = col.label.split('\n');
            doc.font('Helvetica-Bold').fontSize(FS_COL_HDR).fillColor('#000000')
                .text(l1, cx + 2, y + 4, { width: col.w - 4, align: 'center', lineBreak: false })
                .text(l2, cx + 2, y + 4 + FS_COL_HDR + 2, { width: col.w - 4, align: 'center', lineBreak: false });
        } else {
            txt(doc, col.label, cx, y, col.w, COL_HDR_H, { bold: true, size: FS_COL_HDR, align: 'center' });
        }
        cx += col.w;
    }
    y += COL_HDR_H;

    return y;
}

// ─── Draw one invoice entry ────────────────────────────────────────────────────
function drawInvoice(doc, invoice, srNo, y, meta) {
    const invoiceBlockH = INFO_ROW_H + SIZE_ROW_H + TOTAL_ROW_H;

    // Page break check
    if (y + invoiceBlockH > PH - 20) {
        doc.addPage();
        y = 15;
        y = drawCompanyHeader(doc, meta, y);
        y = drawSectionHeader(doc, y);
    }
    const startY = y;

    // ── Info row: Sr | Invoice | LC | Buyer | Amount | AWB ────────────────────
    let cx = ML;

    // Single outer border for the entire info row — no internal vertical dividers
    rect(doc, ML, y, CONTENT_W, INFO_ROW_H, null, '#000000');

    // Sr. No.
    txt(doc, srNo, cx, y, C_SR, INFO_ROW_H, { bold: false, size: FS_INFO, align: 'center' });
    cx += C_SR;

    // Invoice No. & Date
    txt(doc, `${invoice.invoiceNo}  ${invoice.invoiceDate}`, cx, y, C_INV, INFO_ROW_H,
        { size: FS_INFO, align: 'center' });
    cx += C_INV;

    // LC No. & Date
    txt(doc, `${invoice.lcNo ?? ''}  ${invoice.lcDate ?? ''}`.trim(), cx, y, C_LC, INFO_ROW_H,
        { size: FS_INFO, align: 'center' });
    cx += C_LC;

    // Buyer Name & Country
    txt(doc, invoice.buyerName, cx, y, C_BUYER, INFO_ROW_H, { size: FS_INFO, align: 'center' });
    cx += C_BUYER;

    // Amount
    txt(doc, invoice.amount, cx, y, C_AMT, INFO_ROW_H, { size: FS_INFO, align: 'center' });
    cx += C_AMT;

    // AWB
    txt(doc, `${invoice.blawbNo}  ${invoice.blawbDate}`, cx, y, C_AWB, INFO_ROW_H,
        { size: FS_INFO, align: 'center' });

    y += INFO_ROW_H;

    // ── Size boxes row — all 17 sizes in one horizontal row ───────────────────
    // Each box width = CONTENT_W / 17
    const boxW = CONTENT_W / SIZES.length;  // ~47.76 pts each

    cx = ML;
    for (const size of SIZES) {
        const qty = invoice.sizes[size] ?? 0;

        // Outer box
        rect(doc, cx, y, boxW, SIZE_ROW_H, null, '#000000');

        // Dashed divider line between label and value (halfway)
        const midY = y + SIZE_ROW_H / 2;
        doc.save()
            .moveTo(cx, midY).lineTo(cx + boxW, midY)
            .dash(2, { space: 2 })
            .stroke('#888888')
            .restore();

        // Size label (top half)
        txt(doc, size, cx, y, boxW, SIZE_ROW_H / 2,
            { bold: true, size: FS_SIZE_LBL, align: 'center', pad: 1 });

        // Qty value (bottom half)
        txt(doc, qty.toFixed(3), cx, y + SIZE_ROW_H / 2, boxW, SIZE_ROW_H / 2,
            { size: FS_SIZE_VAL, align: 'center', pad: 1 });

        cx += boxW;
    }

    y += SIZE_ROW_H;

    // ── Total row ──────────────────────────────────────────────────────────────
    const total = SIZES.reduce((s, sz) => s + (invoice.sizes[sz] || 0), 0);

    // Total cell — label and value stacked vertically in one box
    const TOTAL_CELL_W = boxW * 3;
    const TOTAL_CELL_H = TOTAL_ROW_H * 2;
    rect(doc, ML, y, TOTAL_CELL_W, TOTAL_CELL_H, '#f2f2f2', '#000000');

    // "Total" label on top half
    txt(doc, 'Total', ML, y, TOTAL_CELL_W, TOTAL_ROW_H,
        { bold: true, size: FS_TOTAL, align: 'left', pad: 5 });

    // Value on bottom half
    txt(doc, total.toFixed(3), ML, y + TOTAL_ROW_H, TOTAL_CELL_W, TOTAL_ROW_H,
        { bold: true, size: FS_TOTAL, align: 'left', pad: 5 });

    y += TOTAL_ROW_H * 2;
    doc
        .lineWidth(1)
        .rect(ML, startY, CONTENT_W, y - startY)
        .stroke('#000000');

    return y;
}

// ─── Draw grand totals block ───────────────────────────────────────────────────
function drawGrandTotals(doc, grandTotals, grandAmount, y, meta) {
    const blockH = INFO_ROW_H + SIZE_ROW_H + TOTAL_ROW_H;
    if (y + blockH > PH - 20) {
        doc.addPage();
        y = 15;
        y = drawCompanyHeader(doc, meta, y);
        y = drawSectionHeader(doc, y);
    }

    // ── Grand info row ─────────────────────────────────────────────────────────
    // Spans Sr+Invoice+LC merged, then Buyer centred shows "Total", Amount shows grand amount
    rect(doc, ML, y, C_SR + C_INV + C_LC, INFO_ROW_H, null, '#000000');

    rect(doc, ML + C_SR + C_INV + C_LC, y, C_BUYER, INFO_ROW_H, null, '#000000');
    txt(doc, 'Total', ML + C_SR + C_INV + C_LC, y, C_BUYER, INFO_ROW_H,
        { bold: true, size: FS_INFO, align: 'center' });

    rect(doc, ML + C_SR + C_INV + C_LC + C_BUYER, y, C_AMT, INFO_ROW_H, null, '#000000');
    txt(doc, grandAmount, ML + C_SR + C_INV + C_LC + C_BUYER, y, C_AMT, INFO_ROW_H,
        { bold: true, size: FS_INFO - 1, align: 'center' });

    rect(doc, ML + C_SR + C_INV + C_LC + C_BUYER + C_AMT, y, C_AWB, INFO_ROW_H, null, '#000000');

    y += INFO_ROW_H;

    // ── Grand size totals row ──────────────────────────────────────────────────
    const boxW = CONTENT_W / SIZES.length;
    let cx = ML;

    for (const size of SIZES) {
        const qty = grandTotals[size] ?? 0;
        rect(doc, cx, y, boxW, SIZE_ROW_H, '#bfbfbf', '#000000');

        const midY = y + SIZE_ROW_H / 2;
        doc.save()
            .moveTo(cx, midY).lineTo(cx + boxW, midY)
            .dash(2, { space: 2 })
            .stroke('#666666')
            .restore();

        txt(doc, size, cx, y, boxW, SIZE_ROW_H / 2, { bold: true, size: FS_SIZE_LBL, align: 'center', pad: 1 });
        txt(doc, qty.toFixed(3), cx, y + SIZE_ROW_H / 2, boxW, SIZE_ROW_H / 2,
            { bold: true, size: FS_SIZE_VAL, align: 'center', pad: 1 });
        cx += boxW;
    }
    y += SIZE_ROW_H;

    // Grand total sum
    const grandTotal = SIZES.reduce((s, sz) => s + (grandTotals[sz] || 0), 0);
    const TOTAL_CELL_W = boxW * 3;
    const TOTAL_CELL_H = TOTAL_ROW_H * 2;
    rect(doc, ML, y, TOTAL_CELL_W, TOTAL_CELL_H, '#bfbfbf', '#000000');
    txt(doc, 'Total', ML, y, TOTAL_CELL_W, TOTAL_ROW_H,
        { bold: true, size: FS_TOTAL, align: 'left', pad: 5 });
    txt(doc, grandTotal.toFixed(3), ML, y + TOTAL_ROW_H, TOTAL_CELL_W, TOTAL_ROW_H,
        { bold: true, size: FS_TOTAL, align: 'left', pad: 5 });
}

// ─── Main export ───────────────────────────────────────────────────────────────
function generateSizeWiseReport({ meta, invoices, grandTotals, grandAmount }) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0, autoFirstPage: true });
        const chunks = [];
        doc.on('data', c => chunks.push(c));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        let y = 15;
        y = drawCompanyHeader(doc, meta, y);
        y = drawSectionHeader(doc, y);

        invoices.forEach((invoice, idx) => {
            y = drawInvoice(doc, invoice, idx + 1, y, meta);
        });

        // Auto-compute grand totals if not provided
        if (!grandTotals) {
            grandTotals = {};
            for (const sz of SIZES) grandTotals[sz] = 0;
            for (const inv of invoices) {
                for (const sz of SIZES) grandTotals[sz] += inv.sizes[sz] || 0;
            }
        }

        drawGrandTotals(doc, grandTotals, grandAmount, y, meta);
        doc.end();
    });
}

module.exports = { generateSizeWiseReport };

// ─── Smoke Test ───────────────────────────────────────────────────────────────
if (require.main === module) {
    const fs = require('fs');

    const meta = {
        companyName: 'DCS INTERNATIONAL TRADING COMPNAY',
        address: 'PLOT NO. 81-B, BASEMENT & GROUND FLOOR, SECTOR-5, IMT MANESAR, GURUGRAM',
        from: '01-Apr-2026',
        to: '26-Jun-2026',
    };

    const invoices = [
        {
            invoiceNo: '01/DCS/26-27', invoiceDate: '07/Apr/2026', lcNo: '', lcDate: '',
            buyerName: 'PEARLCOIN ( HONG KONG ) LIMITED. HONG KONG',
            amount: 'US$ 296145.00', blawbNo: '615-6313-8585', blawbDate: '07/Apr/2026',
            sizes: { '4"': 0, '6"': 0, '7"': 0, '8"': 175, '9"': 50, '10"': 350, '12"': 275, '14"': 225, '16"': 135, '18"': 150, '20"': 115, '22"': 50, '24"': 40, '26"': 40, '28"': 20, '30"': 0, '32"': 0 },
        },
        {
            invoiceNo: '02/DCS/26-27', invoiceDate: '07/Apr/2026', lcNo: '', lcDate: '',
            buyerName: 'YUZHOU YIBALI HAIR PRODUCTS CO., LTD. CHINA',
            amount: 'US$ 264030.25', blawbNo: '180-6330-1836', blawbDate: '18/Apr/2026',
            sizes: { '4"': 0, '6"': 75, '7"': 83, '8"': 150, '9"': 50, '10"': 200, '12"': 200, '14"': 180, '16"': 150, '18"': 125, '20"': 95, '22"': 55, '24"': 60, '26"': 30, '28"': 12, '30"': 0, '32"': 0 },
        },
        {
            invoiceNo: '03/DCS/26-27', invoiceDate: '08/Apr/2026', lcNo: '', lcDate: '',
            buyerName: 'ECO ALLIANCE HOLDING CO., LIMITED. HONG KONG',
            amount: 'US$ 136978.00', blawbNo: '618-2520-2575', blawbDate: '09/Apr/2026',
            sizes: { '4"': 0, '6"': 0, '7"': 0, '8"': 0, '9"': 0, '10"': 0, '12"': 0, '14"': 0, '16"': 0, '18"': 0, '20"': 0, '22"': 0, '24"': 0, '26"': 125, '28"': 50, '30"': 20, '32"': 5 },
        },
        {
            invoiceNo: '04/DCS/26-27', invoiceDate: '09/Apr/2026', lcNo: '', lcDate: '',
            buyerName: 'YUZHOU YIBALI HAIR PRODUCTS CO., LTD. CHINA',
            amount: 'US$ 496480.00', blawbNo: '180-6330-1851', blawbDate: '10/Apr/2026',
            sizes: { '4"': 0, '6"': 150, '7"': 150, '8"': 280, '9"': 60, '10"': 390, '12"': 375, '14"': 340, '16"': 265, '18"': 245, '20"': 170, '22"': 85, '24"': 100, '26"': 45, '28"': 20, '30"': 0, '32"': 0 },
        },
        {
            invoiceNo: '05/DCS/26-27', invoiceDate: '14/Apr/2026', lcNo: '', lcDate: '',
            buyerName: 'YUZHOU YIBALI HAIR PRODUCTS CO., LTD. CHINA',
            amount: 'US$ 442615.00', blawbNo: '180-6330-1862', blawbDate: '15/Apr/2026',
            sizes: { '4"': 0, '6"': 0, '7"': 155, '8"': 265, '9"': 70, '10"': 350, '12"': 330, '14"': 305, '16"': 225, '18"': 225, '20"': 155, '22"': 75, '24"': 80, '26"': 45, '28"': 20, '30"': 0, '32"': 0 },
        },
        {
            invoiceNo: '06/DCS/26-27', invoiceDate: '17/Apr/2026', lcNo: '', lcDate: '',
            buyerName: 'XUCHANG JARIN HAIR PRODUCTS CO., LTD., CHINA',
            amount: 'US$ 749070.00', blawbNo: '180-6330-1862', blawbDate: '15/Apr/2026',
            sizes: { '4"': 0, '6"': 275, '7"': 185, '8"': 100, '9"': 300, '10"': 295, '12"': 185, '14"': 155, '16"': 410, '18"': 215, '20"': 220, '22"': 550, '24"': 55, '26"': 25, '28"': 50, '30"': 40, '32"': 15 },
        },
        {
            invoiceNo: '07/DCS/26-27', invoiceDate: '21/Apr/2026', lcNo: '', lcDate: '',
            buyerName: 'YUZHOU YIBALI HAIR PRODUCTS CO., LTD. CHINA',
            amount: 'US$ 865050.00', blawbNo: '180-6330-1884', blawbDate: '22/Apr/2026',
            sizes: { '4"': 0, '6"': 0, '7"': 0, '8"': 525, '9"': 130, '10"': 670, '12"': 640, '14"': 600, '16"': 460, '18"': 430, '20"': 320, '22"': 215, '24"': 160, '26"': 60, '28"': 35, '30"': 0, '32"': 0 },
        },
        {
            invoiceNo: '08/DCS/26-27', invoiceDate: '23/Apr/2026', lcNo: '', lcDate: '',
            buyerName: 'XUCHANG YIMEIYUAN ART AND CRAFT TRADING CO.,LTD. CHINA',
            amount: 'US$ 701315.00', blawbNo: '180-6330-1895', blawbDate: '24/Apr/2026',
            sizes: { '4"': 0, '6"': 0, '7"': 0, '8"': 385, '9"': 120, '10"': 475, '12"': 435, '14"': 415, '16"': 345, '18"': 325, '20"': 265, '22"': 170, '24"': 165, '26"': 65, '28"': 35, '30"': 0, '32"': 0 },
        },
        {
            invoiceNo: '09/DCS/26-27', invoiceDate: '01/May/2026', lcNo: '', lcDate: '',
            buyerName: 'XUCHANG JARIN HAIR PRODUCTS CO., LTD., CHINA',
            amount: 'US$ 508150.00', blawbNo: '180-6330-1906', blawbDate: '02/May/2026',
            sizes: { '4"': 0, '6"': 600, '7"': 385.5, '8"': 40, '9"': 240, '10"': 275, '12"': 310, '14"': 185, '16"': 265, '18"': 315, '20"': 215, '22"': 72, '24"': 38, '26"': 24, '28"': 24, '30"': 8, '32"': 3.5 },
        },
        {
            invoiceNo: '10/DCS/26-27', invoiceDate: '05/May/2026', lcNo: '', lcDate: '',
            buyerName: 'XUCHANG YIMEIYUAN ART AND CRAFT TRADING CO.,LTD. CHINA',
            amount: 'US$ 378860.00', blawbNo: '180-6330-1910', blawbDate: '06/May/2026',
            sizes: { '4"': 0, '6"': 0, '7"': 0, '8"': 200, '9"': 60, '10"': 290, '12"': 280, '14"': 255, '16"': 185, '18"': 190, '20"': 140, '22"': 75, '24"': 75, '26"': 30, '28"': 20, '30"': 0, '32"': 0 },
        },
    ];

    (async () => {
        console.log('\nGenerating report...\n');
        try {
            const buf = await generateSizeWiseReport({
                meta, invoices,
                grandTotals: null,
                grandAmount: 'US$ 9,630,944.75',
            });
            fs.writeFileSync('smoke_report.pdf', buf);
            console.log('✅  smoke_report.pdf');
        } catch (err) {
            console.error('❌', err.message);
            console.error(err.stack);
        }
        console.log('\nDone.\n');
    })();
}