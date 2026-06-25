"use client";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: "#FFFFFF", fontFamily: "Helvetica" },
  badge: { flexDirection: "row", gap: 8, marginBottom: 20 },
  badgePill: {
    backgroundColor: "#7C3AED",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { color: "#FFFFFF", fontSize: 9, fontWeight: "bold" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
    lineHeight: 1.3,
  },
  meta: { flexDirection: "row", gap: 16, marginBottom: 20 },
  metaItem: { flexDirection: "row", gap: 4, alignItems: "center" },
  metaLabel: { fontSize: 9, color: "#9CA3AF", textTransform: "uppercase" },
  metaValue: { fontSize: 9, color: "#6B7280", fontWeight: "bold" },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 20,
  },
  content: { fontSize: 11, color: "#374151", lineHeight: 1.8 },
  author: {
    marginTop: 32,
    padding: 16,
    backgroundColor: "#F5F3FF",
    borderRadius: 8,
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  authorName: { fontSize: 11, fontWeight: "bold", color: "#111827" },
  authorSub: { fontSize: 9, color: "#9CA3AF", marginTop: 2 },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: { fontSize: 8, color: "#D1D5DB" },
});

function LessonDocument({ lesson }) {
  const date = lesson.createdAt
    ? new Date(lesson.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <Document title={lesson.title} author={lesson.userName || "LifeVault"}>
      <Page size="A4" style={styles.page}>
        {/* Badges */}
        <View style={styles.badge}>
          {lesson.category && (
            <View style={[styles.badgePill, { backgroundColor: "#7C3AED" }]}>
              <Text style={styles.badgeText}>{lesson.category}</Text>
            </View>
          )}
          {lesson.emotionalTone && (
            <View style={[styles.badgePill, { backgroundColor: "#0891B2" }]}>
              <Text style={styles.badgeText}>{lesson.emotionalTone}</Text>
            </View>
          )}
          {lesson.accessLevel === "premium" && (
            <View style={[styles.badgePill, { backgroundColor: "#D97706" }]}>
              <Text style={styles.badgeText}>⭐ Premium</Text>
            </View>
          )}
        </View>

        {/* Title */}
        <Text style={styles.title}>{lesson.title}</Text>

        {/* Meta */}
        <View style={styles.meta}>
          {[
            { label: "Author", value: lesson.userName || "Anonymous" },
            { label: "Date", value: date },
            { label: "Views", value: String(lesson.views || 0) },
            { label: "Likes", value: String(lesson.likesCount || 0) },
          ].map((m) => (
            <View key={m.label} style={styles.metaItem}>
              <Text style={styles.metaLabel}>{m.label}: </Text>
              <Text style={styles.metaValue}>{m.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* Content */}
        <Text style={styles.content}>{lesson.description}</Text>

        {/* Author card */}
        <View style={styles.author}>
          <View>
            <Text style={styles.authorName}>
              {lesson.userName || "Anonymous"}
            </Text>
            <Text style={styles.authorSub}>Author · LifeVault</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            LifeVault — life-vault-smoky.vercel.app
          </Text>
          <Text style={styles.footerText}>{lesson.title}</Text>
        </View>
      </Page>
    </Document>
  );
}

export default function ExportPDFButton({ lesson }) {
  const fileName = `${lesson.title?.slice(0, 40).replace(/\s+/g, "_")}.pdf`;

  return (
    <PDFDownloadLink
      document={<LessonDocument lesson={lesson} />}
      fileName={fileName}
    >
      {({ loading, error }) => (
        <button
          disabled={loading}
          className="flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
          style={{
            backgroundColor: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#f87171",
          }}
        >
          {loading ? "⏳ Preparing..." : "⬇ Export PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
}
