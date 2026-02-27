import React from "react"
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"

// Register font (optional for better rendering, using default for now)
Font.register({
    family: "Helvetica",
    fonts: [{ src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf" }]
})

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: "Helvetica",
        fontSize: 10,
        color: "#1a1a1a",
        lineHeight: 1.5,
    },
    header: {
        marginBottom: 30,
        borderBottom: "2px solid #e2e8f0",
        paddingBottom: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
        color: "#0f172a"
    },
    subtitle: {
        fontSize: 12,
        color: "#64748b",
        textAlign: "center"
    },
    section: {
        marginBottom: 20,
    },
    heading: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 10,
        backgroundColor: "#f1f5f9",
        padding: 5,
    },
    row: {
        flexDirection: "row",
        marginBottom: 5,
    },
    label: {
        width: 150,
        fontWeight: "bold",
        color: "#334155"
    },
    value: {
        flex: 1,
    },
    paragraph: {
        marginBottom: 10,
        textAlign: "justify"
    },
    signatureBlock: {
        marginTop: 50,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    signatureBox: {
        width: 200,
        borderTop: "1px solid #94a3b8",
        paddingTop: 10,
        marginHorizontal: 10,
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: "center",
        color: "#94a3b8",
        fontSize: 8,
        borderTop: "1px solid #e2e8f0",
        paddingTop: 10,
    }
})

interface ContractProps {
    data: {
        proName: string,
        proSiret: string,
        actorName: string,
        actorEmail: string,
        castingTitle: string,
        castingDates: string,
        castingLieu: string,
        remuneration: string,
        documentType: string
    }
}

export default function ContractTemplate({ data }: ContractProps) {
    const isImageRights = data.documentType === "IMAGE_RIGHTS"

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {isImageRights ? "CESSION DE DROIT À L'IMAGE" : "CONTRAT D'ENGAGEMENT"}
                    </Text>
                    <Text style={styles.subtitle}>
                        Ciné Sénégal - {data.castingTitle}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>ENTRE LES SOUSSIGNÉS</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>La Production :</Text>
                        <Text style={styles.value}>{data.proName} (SIRET/NINEA: {data.proSiret})</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Ci-après dénommé(e) :</Text>
                        <Text style={styles.value}>"Le Producteur"</Text>
                    </View>
                    <Text style={{ marginVertical: 10, fontWeight: "bold" }}>ET</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>L'Artiste / Talent :</Text>
                        <Text style={styles.value}>{data.actorName} ({data.actorEmail})</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Ci-après dénommé(e) :</Text>
                        <Text style={styles.value}>"L'Artiste"</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>ARTICLE 1 - OBJET DU CONTRAT</Text>
                    <Text style={styles.paragraph}>
                        {isImageRights
                            ? `Le présent contrat a pour objet d'autoriser le Producteur à fixer, reproduire, et communiquer au public l'image et la voix de l'Artiste captées lors du tournage du projet défini ci-après.`
                            : `Le Producteur engage l'Artiste pour participer à la réalisation du projet audiovisuel intitulé "${data.castingTitle}". L'Artiste s'engage à fournir sa prestation et à respecter le plan de travail établi.`
                        }
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>ARTICLE 2 - CONDITIONS DE TOURNAGE</Text>
                    <View style={styles.row}>
                        <Text style={styles.label}>Dates prévues :</Text>
                        <Text style={styles.value}>{data.castingDates}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Lieu(x) de tournage :</Text>
                        <Text style={styles.value}>{data.castingLieu}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Rémunération / Défraiement :</Text>
                        <Text style={styles.value}>{data.remuneration}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.heading}>ARTICLE 3 - EXPLOITATION ET DROITS</Text>
                    <Text style={styles.paragraph}>
                        Les droits concédés au Producteur sont valables pour le monde entier et pour la durée légale de protection des droits d'auteur, en vue de toute exploitation (Cinéma, Télévision, Internet, VOD, Festivals, Promotion). L'Artiste garantit qu'il n'est lié par aucun contrat exclusif empêchant la présente cession.
                    </Text>
                </View>

                <View style={styles.signatureBlock}>
                    <View style={styles.signatureBox}>
                        <Text style={{ marginBottom: 5 }}>Fait à Dakar, le {new Date().toLocaleDateString("fr-FR")}</Text>
                        <Text style={{ fontWeight: "bold" }}>Le Producteur</Text>
                        <Text style={{ fontSize: 8, color: "#94a3b8", marginTop: 2 }}>Lu et approuvé</Text>
                    </View>

                    <View style={styles.signatureBox}>
                        <Text style={{ marginBottom: 5 }}>Fait à ......................................</Text>
                        <Text style={{ fontWeight: "bold" }}>L'Artiste</Text>
                        <Text style={{ fontSize: 8, color: "#94a3b8", marginTop: 2 }}>Lu et approuvé</Text>
                    </View>
                </View>

                <Text style={styles.footer}>
                    Document généré électroniquement via la plateforme PRO Ciné Sénégal (Kilife Studio) le {new Date().toLocaleString("fr-FR")}
                </Text>
            </Page>
        </Document>
    )
}
