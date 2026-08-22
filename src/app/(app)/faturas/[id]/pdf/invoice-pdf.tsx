import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#111" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  workspaceName: { fontSize: 16, fontWeight: 700 },
  title: { fontSize: 20, fontWeight: 700, textAlign: "right" },
  meta: { fontSize: 10, color: "#555", textAlign: "right", marginTop: 4 },
  section: { marginBottom: 20 },
  label: {
    fontSize: 8,
    color: "#888",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  value: { fontSize: 11 },
  table: { marginTop: 10, borderTop: "1 solid #ddd" },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #eee",
    paddingVertical: 8,
  },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottom: "1 solid #111",
    paddingBottom: 6,
    fontWeight: 700,
  },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: "right" },
  colPrice: { flex: 1, textAlign: "right" },
  colTotal: { flex: 1, textAlign: "right" },
  totals: { marginTop: 16, alignItems: "flex-end" },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
    marginBottom: 4,
  },
  totalsLabel: { color: "#555" },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
    marginTop: 6,
    paddingTop: 6,
    borderTop: "1 solid #111",
  },
  grandTotalLabel: { fontSize: 12, fontWeight: 700 },
  grandTotalValue: { fontSize: 12, fontWeight: 700 },
});

function money(value: string | number) {
  return `${Number(value).toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}

export type InvoicePdfProps = {
  workspaceName: string;
  number: number;
  status: string;
  createdAt: Date;
  dueDate: Date | null;
  clientName: string;
  subtotal: string;
  taxAmount: string;
  total: string;
  items: { description: string; quantity: string; unitPrice: string }[];
};

const STATUS_LABEL: Record<string, string> = {
  rascunho: "Rascunho",
  enviada: "Enviada",
  paga: "Paga",
  cancelada: "Cancelada",
};

export function InvoicePdf({
  workspaceName,
  number,
  status,
  createdAt,
  dueDate,
  clientName,
  subtotal,
  taxAmount,
  total,
  items,
}: InvoicePdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.workspaceName}>{workspaceName}</Text>
          </View>
          <View>
            <Text style={styles.title}>FATURA #{number}</Text>
            <Text style={styles.meta}>
              Emitida em {createdAt.toLocaleDateString("pt-PT")}
            </Text>
            {dueDate && (
              <Text style={styles.meta}>
                Vencimento: {dueDate.toLocaleDateString("pt-PT")}
              </Text>
            )}
            <Text style={styles.meta}>{STATUS_LABEL[status] ?? status}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Cliente</Text>
          <Text style={styles.value}>{clientName}</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.colDesc}>Descrição</Text>
            <Text style={styles.colQty}>Qtd.</Text>
            <Text style={styles.colPrice}>Preço unit.</Text>
            <Text style={styles.colTotal}>Total</Text>
          </View>
          {items.map((item, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.colDesc}>{item.description}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>{money(item.unitPrice)}</Text>
              <Text style={styles.colTotal}>
                {money(Number(item.quantity) * Number(item.unitPrice))}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Subtotal</Text>
            <Text>{money(subtotal)}</Text>
          </View>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>IVA</Text>
            <Text>{money(taxAmount)}</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>{money(total)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
