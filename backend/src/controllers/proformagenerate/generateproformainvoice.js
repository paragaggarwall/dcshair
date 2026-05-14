const PDFDocument = require("pdfkit");
const fs = require("fs");

// ─────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────
const PAGE_W = 595.28; // A4
const PAGE_H = 841.89; // A4

const OUTER_MARGIN = 20; // outer rect margin
const INNER_MARGIN = 25; // inner rect margin (the second border)

// Inner rect bounds
const IX = INNER_MARGIN;
const IY = INNER_MARGIN;
const IW = PAGE_W - INNER_MARGIN * 2;

const PAD = 4; // cell padding

// Column split: left half | right half of upper section
const LEFT_W = IW * 0.48;
const RIGHT_X = IX + LEFT_W;
const RIGHT_W = IW - LEFT_W;

// Right column sub-split for rows that have 2 cols
const RIGHT_COL1_W = RIGHT_W * 0.55;
const RIGHT_COL2_X = RIGHT_X + RIGHT_COL1_W;
const RIGHT_COL2_W = RIGHT_W - RIGHT_COL1_W;

// Lower table column widths (4 columns)
const COL1_W = IW * 0.65; // Marks / Description
const COL2_W = IW * 0.10; // Qty KGS
const COL3_W = IW * 0.10; // Rate
const COL4_W = IW - COL1_W - COL2_W - COL3_W; // Amount

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────

/** Measure text height inside a given width */
function textH(doc, text, width, fontSize = 8) {
    doc.fontSize(fontSize);
    return doc.heightOfString(String(text || ""), { width: width - PAD * 2 });
}

/** Draw a label (bold) + value pair stacked in a cell, return content height */
function cellContent(doc, label, value, x, y, w, labelSize = 7, valueSize = 8) {
    let cy = y + PAD;
    doc.font("Helvetica").fontSize(labelSize).text(label, x + PAD, cy, { width: w - PAD * 2 });
    cy += doc.heightOfString(label, { width: w - PAD * 2 }) + 4;
    if (value !== undefined && value !== null && value !== "") {
        doc.font("Helvetica-Bold").fontSize(valueSize).text(String(value), x + PAD, cy, { width: w - PAD * 2 });
        cy += doc.heightOfString(String(value), { width: w - PAD * 2 });
    }
    return cy - y + PAD; // total height used
}

/** Measure a label+value cell height without drawing */
function measureCell(doc, label, value, w, labelSize = 7, valueSize = 8) {
    let h = PAD;
    doc.font("Helvetica").fontSize(labelSize);
    h += doc.heightOfString(String(label || ""), { width: w - PAD * 2 }) + 4;
    if (value !== undefined && value !== null && value !== "") {
        doc.font("Helvetica-Bold").fontSize(valueSize);
        h += doc.heightOfString(String(value || ""), { width: w - PAD * 2 });
    }
    return h + PAD;
}

/** Draw horizontal line across inner rect */
function hLine(doc, y) {
    doc.moveTo(IX, y).lineTo(IX + IW, y).stroke();
}

/** Draw horizontal line scoped to a specific x range */
function hLineScoped(doc, y, x1, x2) {
    doc.moveTo(x1, y).lineTo(x2, y).stroke();
}

/** Draw vertical line segment */
function vLine(doc, x, y1, y2) {
    doc.moveTo(x, y1).lineTo(x, y2).stroke();
}

/** Draw a filled rectangle background */
function fillRect(doc, x, y, w, h, color = "#e8e8e8") {
    doc.save().fillColor(color).rect(x, y, w, h).fill().restore();
}

// ─────────────────────────────────────────────
//  MAIN GENERATOR
// ─────────────────────────────────────────────

function generateProformaInvoice(data, outputStream) {
    console.log("data", data);
    const doc = new PDFDocument({ size: "A4", margin: 0, autoFirstPage: true });
    doc.pipe(outputStream);

    // ── Outer border ──────────────────────────────
    doc.rect(OUTER_MARGIN, OUTER_MARGIN, PAGE_W - OUTER_MARGIN * 2, PAGE_H - OUTER_MARGIN * 2).stroke();

    // ── Title ─────────────────────────────────────
    doc.font("Helvetica-Bold").fontSize(14).text("PROFORMA INVOICE", 0, OUTER_MARGIN + 6, { align: "center", width: PAGE_W });

    const titleH = 28;

    // ── Inner border start ─────────────────────────
    const innerStartY = OUTER_MARGIN + titleH;

    // ─────────────────────────────────────────────
    //  BUILD UPPER SECTION ROW HEIGHTS DYNAMICALLY
    // ─────────────────────────────────────────────

    const { consignee = {}, notifyParty = {}, buyer = {} } = data;

    const consigneeText = [
        consignee.name,
        consignee.address,
        `USCI NUMBER: ${consignee.usci || ""}`,
        `CTC: ${consignee.ctc || ""}  TEL: ${consignee.phone || ""}`,
        consignee.country,
    ].filter(Boolean).join("\n");

    const notifyText = [
        notifyParty.name,
        notifyParty.address,
        `USCI NUMBER: ${notifyParty.usci || ""}`,
        `CTC: ${notifyParty.ctc || ""}  TEL: ${notifyParty.phone || ""}`,
        notifyParty.country,
    ].filter(Boolean).join("\n");

    const buyerText = [
        buyer.name,
        buyer.address,
        `USCI NUMBER: ${buyer.usci || ""}`,
        `CTC: ${buyer.ctc || ""}  TEL: ${buyer.phone || ""}`,
        buyer.country,
    ].filter(Boolean).join("\n");

    // ── LEFT COLUMN ROW HEIGHTS ────────────────────

    // Row 1: Exporter (left) | rows 1-3 right
    let expH = PAD;
    doc.font("Helvetica").fontSize(7);
    expH += doc.heightOfString("Exporter", { width: LEFT_W - PAD * 2 }) + 20;
    doc.font("Helvetica-Bold").fontSize(10);
    expH += doc.heightOfString("DCS INTERNATIONAL TRADING COMPANY", { width: LEFT_W - PAD * 2 }) + 10;
    doc.font("Helvetica-Bold").fontSize(8);
    expH += doc.heightOfString("PLOT NO. 81-B, BASEMENT & GROUNG FLOOR, SECTOR-5, IMT MANESAR, GURUGRAM", { width: LEFT_W - PAD * 2 }) + 10;
    expH += doc.heightOfString("HARYANA-122052(INDIA)\nTel. :+91-012-44068177 Fax. : ", { width: LEFT_W - PAD * 2 });
    expH += PAD;
    const exporterH = expH;

    // Right rows 1-3 stacked (must match exporter height together)
    const invoiceLabel = `${data.invoiceNo || ""} - ${data.invoiceDate || ""}`;
    const r1LeftH = measureCell(doc, "Proforma Invoice No. & Date", invoiceLabel, RIGHT_COL1_W);
    const r1RightH = measureCell(doc, "Exporter's Ref.", data.exporterRef || "", RIGHT_COL2_W);
    const row1RightH = Math.max(r1LeftH, r1RightH);

    const buyerOrderLabel = `${data.buyerOrderNo || ""}  ${data.buyerOrderDate || ""}`.trim();
    const lcLabel = `${data.lcNo || ""}  ${data.lcDate || ""}`.trim();
    const r2LeftH = measureCell(doc, "Buyer's Order No. & Date", buyerOrderLabel, RIGHT_COL1_W);
    const r2RightH = measureCell(doc, "L/C No. & Date", lcLabel, RIGHT_COL2_W);
    const row2RightH = Math.max(r2LeftH, r2RightH);

    const row3RightH = measureCell(doc, "Other Reference(s)", data.otherRef || "", RIGHT_W);

    const rightTop3H = row1RightH + row2RightH + row3RightH;
    const leftRow1H = Math.max(exporterH, rightTop3H);

    // Row 2: Consignee (left) | Buyer (right)
    const consigneeH = measureCell(doc, "Consignee", consigneeText, LEFT_W);
    const buyerH = measureCell(doc, "Buyer (other than consignee)", buyerText, RIGHT_W);
    const leftRow2H = Math.max(consigneeH, buyerH);

    // Row 3: Notify Party (left) | Country of Origin / Destination (right) + Terms
    const notifyH = measureCell(doc, "Notify Party", notifyText, LEFT_W);
    const coOrgH = measureCell(doc, "Country of Origin of Goods", data.countryOfOrigin || "", RIGHT_COL1_W);
    const coDestH = measureCell(doc, "Country of Final Destination", data.countryOfDestination || "", RIGHT_COL2_W);
    const countryRowH = Math.max(coOrgH, coDestH);
    const termsH = measureCell(doc, "Terms of Delivery and Payment", data.deliveryTerms || "", RIGHT_W);
    const rightRow3H = countryRowH + termsH;
    const leftRow3H = Math.max(notifyH, rightRow3H);

    // Row 4 (shipping grid) — spans FULL WIDTH, split into left and right halves
    // Left half: Pre-Carriage By, Vessel/Flight No., Port of Discharge
    // Right half: Place of Receipt by Pre-carrier, Port of Loading, Final Destination
    // Both halves have 3 sub-rows each; right column (Terms) area stays blank
    const shippingLabels1 = ["Pre-Carriage By", "Vessel / Flight No.", "Port of Discharge"];
    const shippingVals1 = [data.preCarriageBy || "", data.vesselFlightNo || "", data.portOfFinalDestination || ""];
    const shippingLabels2 = ["Place of Receipt by Pre-carrier", "Port of Loading", "Final Destination"];
    const shippingVals2 = [data.placeOfReceipt || "", data.portOfLoading || "", data.portOfFinalDestination || ""];

    // Shipping sub-cols split at midpoint of the left column
    const shipMidX = IX + LEFT_W / 2;
    const shipLeftW = LEFT_W / 2;
    const shipRightW = LEFT_W / 2;

    // Shipping row height = tallest of each of the 3 sub-rows
    const shipSubH = shippingLabels1.map((lbl, i) => {
        const lH = measureCell(doc, lbl, shippingVals1[i], shipLeftW);
        const rH = measureCell(doc, shippingLabels2[i], shippingVals2[i], shipRightW);
        return Math.max(lH, rH);
    });
    const leftRow4H = shipSubH.reduce((a, b) => a + b, 0);

    // ─────────────────────────────────────────────
    //  DRAW UPPER SECTION
    // ─────────────────────────────────────────────
    let curY = innerStartY;

    // ── ROW 1 ──────────────────────────────────────
    const row1Top = curY;
    const row1Bot = curY + leftRow1H;

    // Exporter cell (left)
    let eY = row1Top + PAD;
    doc.font("Helvetica").fontSize(7).text("Exporter", IX + PAD, eY, { width: LEFT_W - PAD * 2 });
    eY += doc.heightOfString("Exporter", { width: LEFT_W - PAD * 2 }) + 20;

    doc.font("Helvetica-Bold").fontSize(10).text("DCS INTERNATIONAL TRADING COMPANY", IX + PAD, eY, { width: LEFT_W - PAD * 2 });
    eY += doc.heightOfString("DCS INTERNATIONAL TRADING COMPANY", { width: LEFT_W - PAD * 2 }) + 10;

    doc.font("Helvetica-Bold").fontSize(8).text("PLOT NO. 81-B, BASEMENT & GROUND FLOOR, SECTOR-5, IMT MANESAR, GURUGRAM", IX + PAD, eY, { width: LEFT_W - PAD * 2 });
    eY += doc.heightOfString("PLOT NO. 81-B, BASEMENT & GROUND FLOOR, SECTOR-5, IMT MANESAR, GURUGRAM", { width: LEFT_W - PAD * 2 }) + 10;

    doc.font("Helvetica-Bold").fontSize(8).text("HARYANA-122052(INDIA)\nTel. :+91-012-44068177 Fax. : ", IX + PAD, eY, { width: LEFT_W - PAD * 2 });

    // GST NO. (top right of Exporter cell)
    const gstBoxW = 100;
    const gstBoxX = IX + LEFT_W - gstBoxW - PAD * 2;
    doc.font("Helvetica-Bold").fontSize(7).text("GST NO. :", gstBoxX, row1Top + PAD, { width: gstBoxW, align: "center" });
    doc.font("Helvetica-Bold").fontSize(8).text("06ABJPS8963LIZR", gstBoxX, row1Top + PAD + 9, { width: gstBoxW, align: "center" });

    // Right col vertical divider
    vLine(doc, RIGHT_X, row1Top, row1Bot);

    // Right sub-row 1
    const sub1Top = row1Top;
    const sub1Bot = sub1Top + row1RightH;
    cellContent(doc, "Proforma Invoice No. & Date", invoiceLabel, RIGHT_X, sub1Top, RIGHT_COL1_W);
    vLine(doc, RIGHT_COL2_X, sub1Top, sub1Bot);
    cellContent(doc, "Exporter's Ref.", data.exporterRef || "", RIGHT_COL2_X, sub1Top, RIGHT_COL2_W);
    hLineScoped(doc, sub1Bot, RIGHT_X, IX + IW); // scoped to right column only

    // Right sub-row 2
    const sub2Top = sub1Bot;
    const sub2Bot = sub2Top + row2RightH;
    cellContent(doc, "Buyer's Order No. & Date", buyerOrderLabel, RIGHT_X, sub2Top, RIGHT_COL1_W);
    // vLine(doc, RIGHT_COL2_X, sub2Top, sub2Bot);
    cellContent(doc, "L/C No. & Date", lcLabel, RIGHT_COL2_X, sub2Top, RIGHT_COL2_W);
    hLineScoped(doc, sub2Bot, RIGHT_X, IX + IW); // scoped to right column only

    // Right sub-row 3
    const sub3Top = sub2Bot;
    const sub3Bot = sub3Top + row3RightH;
    cellContent(doc, "Other Reference(s)", data.otherRef || "", RIGHT_X, sub3Top, RIGHT_W);

    // Make sure right col 3 bottom aligns with row1Bot
    hLine(doc, row1Bot);
    curY = row1Bot;

    // ── ROW 2 ──────────────────────────────────────
    const row2Top = curY;
    const row2Bot = curY + leftRow2H;

    cellContent(doc, "Consignee", consigneeText, IX, row2Top, LEFT_W);
    vLine(doc, RIGHT_X, row2Top, row2Bot);
    cellContent(doc, "Buyer (other than consignee)", buyerText, RIGHT_X, row2Top, RIGHT_W);

    hLine(doc, row2Bot);
    curY = row2Bot;

    // ── ROW 3 ──────────────────────────────────────
    const row3Top = curY;
    const row3Bot = curY + leftRow3H;

    cellContent(doc, "Notify Party", notifyText, IX, row3Top, LEFT_W);
    vLine(doc, RIGHT_X, row3Top, row3Bot);

    // Country sub-row
    const cTop = row3Top;
    const cBot = cTop + countryRowH;
    cellContent(doc, "Country of Origin of Goods", data.countryOfOrigin || "", RIGHT_X, cTop, RIGHT_COL1_W);
    vLine(doc, RIGHT_COL2_X, cTop, cBot);
    cellContent(doc, "Country of Final Destination", data.countryOfDestination || "", RIGHT_COL2_X, cTop, RIGHT_COL2_W);
    hLineScoped(doc, cBot, RIGHT_X, IX + IW); // scoped to right column only

    // Terms sub-row
    const tTop = cBot;
    cellContent(doc, "Terms of Delivery and Payment", data.termsOfPayment || "", RIGHT_X, tTop, RIGHT_W);

    // hLine(doc, row3Bot);
    hLineScoped(doc, row3Bot, IX, RIGHT_X);
    curY = row3Bot;

    // ── ROW 4 (Shipping grid) ──────────────────────
    const row4Top = curY;

    let shipY = row4Top;
    shippingLabels1.forEach((lbl, i) => {
        const rH = shipSubH[i];
        const rowBot = shipY + rH;

        cellContent(doc, lbl, shippingVals1[i], IX, shipY, shipLeftW);
        vLine(doc, shipMidX, shipY, rowBot);
        cellContent(doc, shippingLabels2[i], shippingVals2[i], shipMidX, shipY, shipRightW);
        vLine(doc, RIGHT_X, shipY, rowBot);

        if (i < shippingLabels1.length - 1) {
            hLineScoped(doc, rowBot, IX, RIGHT_X);
        }
        shipY = rowBot;
    });

    const row4Bot = shipY;
    hLine(doc, row4Bot);
    curY = row4Bot;

    // ─────────────────────────────────────────────
    //  LOWER SECTION — GOODS TABLE
    // ─────────────────────────────────────────────
    const tableTop = curY;

    // Column X positions
    const col1X = IX;
    const col2X = col1X + COL1_W;
    const col3X = col2X + COL2_W;
    const col4X = col3X + COL3_W;

    // Header row
    doc.font("Helvetica-Bold").fontSize(7);
    const headerParts = [
        { label: "Marks & No. / Container No.\nNo. & Kind of Pkgs\nDescription of Goods", x: col1X, w: COL1_W },
        { label: "Quantity\nKGS", x: col2X, w: COL2_W },
        { label: "Rate\nUS$/KGS", x: col3X, w: COL3_W },
        { label: "Amount\nUS$", x: col4X, w: COL4_W },
    ];

    // const headerH = headerParts.reduce((max, p) => {
    //     const h = doc.heightOfString(p.label, { width: p.w - PAD * 2 }) + PAD * 2;
    //     return Math.max(max, h);
    // }, 0);
    const headerH = 58;

    // Draw header background
    fillRect(doc, IX, tableTop, IW, headerH, "#d0d0d0");
    hLine(doc, tableTop);

    headerParts.forEach((p, idx) => {

        // FIRST COLUMN HEADER
        if (idx === 0) {
            // Dynamic widths INSIDE first column
            const marksW = p.w * 0.18;
            const pkgW = p.w * 0.24;
            const descW = p.w * 0.43;
            const sizeW = p.w * 0.15;

            // X positions
            const marksX = p.x;
            const pkgX = marksX + marksW;
            const descX = pkgX + pkgW;
            const sizeX = descX + descW;

            // Y positions
            const topY = tableTop + 6;
            const subY = topY + 18;
            const valueY = subY + 12;

            doc.font("Helvetica-Bold").fontSize(7);

            // ─────────────────────────────
            // TOP HEADINGS
            // ─────────────────────────────

            // Marks & No.
            doc.text(
                "Marks & No.",
                marksX,
                topY,
                {
                    width: marksW,
                    align: "center",
                }
            );

            // No. & Kind of Pkgs
            doc.text(
                "No. & Kind of Pkgs",
                pkgX,
                topY,
                {
                    width: pkgW,
                    align: "center",
                }
            );

            // Description of Goods
            doc.text(
                "Description of Goods",
                descX,
                topY,
                {
                    width: descW,
                    align: "center",
                }
            );

            // SIZE
            doc.text(
                "SIZE",
                sizeX,
                topY,
                {
                    width: sizeW,
                    align: "center",
                }
            );

            // ─────────────────────────────
            // SUB HEADINGS 
            // ─────────────────────────────

            doc.font("Helvetica").fontSize(6.5);

            // Container No. heading
            doc.text(
                "Container No.",
                marksX,
                subY,
                {
                    width: marksW,
                    align: "center",
                }
            );

            // Carton count
            doc.text(
                data.pkgCount || "104 CARTONS",
                pkgX,
                subY,
                {
                    width: pkgW,
                    align: "center",
                }
            );
            // ─────────────────────────
            // VALUES BELOW SUBHEADINGS
            // ─────────────────────────

            doc.font("Helvetica-Bold").fontSize(7);

            doc.text(
                data.containerNo || "DCS",
                marksX,
                valueY,
                {
                    width: marksW,
                    align: "center",
                }
            );

            doc.text(
                data.containerRange || "001 TO 104",
                marksX,
                valueY + 10,
                {
                    width: marksW,
                    align: "center",
                }
            );

        } else {

            // OTHER HEADERS
            doc.font("Helvetica-Bold").fontSize(7).text(
                p.label,
                p.x + PAD,
                tableTop + PAD,
                {
                    width: p.w - PAD * 2,
                    align: "center",
                }
            );
        }
    });

    let rowY = tableTop + headerH;

    // Vertical dividers for header
    [col2X, col3X, col4X].forEach((x) => vLine(doc, x, tableTop, rowY));
    hLine(doc, rowY);

    // ── Item rows ─────────────────────────────────
    const items = data.items || [];


    // We'll draw the description in col1, but marks text stacked above
    const descText = data.description || "";

    const descH = descText
        ? (doc.font("Helvetica").fontSize(8).heightOfString(descText, { width: COL1_W - PAD * 2 }) + 8)
        : 0;

    // Compute heights for each item line
    const itemHeights = items.map((item) => {
        return (
            doc
                .font("Helvetica")
                .fontSize(8)
                .heightOfString(
                    String(item.size || item.name || ""),
                    {
                        width: COL1_W - PAD * 2,
                    }
                ) + 6
        );
    });

    // Total content height
    const totalItemsH = itemHeights.reduce((a, b) => a + b, 0);

    // Final table body height
    const tableContentH = Math.max(
        220,
        descH + totalItemsH + 20
    );

    const tableBottomY = rowY + tableContentH;


    // Calculate total content height for col1
    let contentY = rowY + PAD;


    // Draw description
    if (descText) {
        doc.font("Helvetica-Bold").fontSize(8).text(descText, col1X + PAD, contentY, { width: COL1_W - PAD * 2 });
        contentY += descH;
    }

    // Draw item rows (right cols) side by side with items in col1
    const itemRowStartY = contentY + 4;

    items.forEach((item, i) => {
        const itemY =
            itemRowStartY +
            itemHeights
                .slice(0, i)
                .reduce((a, b) => a + b, 0);

        // SIZE
        doc.font("Helvetica").fontSize(8).text(
            String(item.size || item.name || ""),
            col1X + PAD,
            itemY,
            {
                width: COL1_W,
                align: "left",
            }
        );

        // QTY
        doc.font("Helvetica").fontSize(8).text(
            String(item.quantity || ""),
            col2X + PAD,
            itemY,
            {
                width: COL2_W - PAD * 2,
                align: "center",
            }
        );

        // RATE
        doc.font("Helvetica").fontSize(8).text(
            String(item.pricePerKg || ""),
            col3X + PAD,
            itemY,
            {
                width: COL3_W - PAD * 2,
                align: "center",
            }
        );

        // AMOUNT
        doc.font("Helvetica").fontSize(8).text(
            Number(item.totalAmount || 0).toFixed(2),
            col4X + PAD,
            itemY,
            {
                width: COL4_W - PAD * 2,
                align: "right",
            }
        );
    });

    // const totalItemsH = itemHeights.reduce((a, b) => a + b, 0);
    // const tableContentH = marksH + descH + totalItemsH + PAD * 2;
    // const tableContentH2 = Math.max(tableContentH, 200); // minimum height for lower section

    // const tableBottomY = rowY + tableContentH2;

    // Vertical dividers for table content
    [col2X, col3X, col4X].forEach((x) => vLine(doc, x, rowY, tableBottomY));

    hLine(doc, tableBottomY);

    // Total row
    const totalH = 20;
    const grandTotal = items.reduce((sum, item) => sum + Number(item.totalAmount || 0), 0);

    doc.font("Helvetica-Bold").fontSize(9).text(
        `TOTAL USD ${grandTotal.toFixed(2)}`,
        col3X + PAD,
        tableBottomY + PAD,
        { width: COL3_W + COL4_W - PAD * 2, align: "right" }
    );

    const finalBottomY = tableBottomY + totalH;
    hLine(doc, finalBottomY);

    // ─────────────────────────────────────────────
    //  OUTER INNER RECT (drawn last so it overlays)
    // ─────────────────────────────────────────────
    // Left border of inner section
    vLine(doc, IX, innerStartY, finalBottomY);
    // Right border
    vLine(doc, IX + IW, innerStartY, finalBottomY);
    // Top of inner section
    hLine(doc, innerStartY);
    // Bottom
    hLine(doc, finalBottomY);

    doc.end();
}

module.exports = { generateProformaInvoice };
