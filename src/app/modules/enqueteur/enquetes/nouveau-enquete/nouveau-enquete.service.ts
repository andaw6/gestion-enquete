import { Injectable } from '@angular/core';
import {Observable, of} from "rxjs";
import {DemandeEnquete, StatsCard} from "@modules/enqueteur/enquetes/nouveau-enquete/model";

@Injectable({
  providedIn: 'root'
})
export class NouveauEnqueteService {
  constructor() {}

  getDemandesEnquete(): Observable<DemandeEnquete[]> {
    // Données mockées pour la démonstration
    const mockData: DemandeEnquete[] = [
      {
        id: 1,
        objet: "SARL InnovTech",
        description:
          "Enquête sur les conditions de travail et la conformité aux normes de sécurité dans l'entreprise SARL InnovTech, suite à plusieurs signalements de non-respect des règles de sécurité.",
        dateCreation: new Date("2024-01-20"),
        priorite: "HAUTE",
        dateEcheance: new Date("2024-02-05"),
        urgent: true,
        etatDemande: { libelle: "En attente", code: "ATTENTE" },
        utilisateurDemandeur: {
          prenom: "Ahmed",
          nom: "Diop",
          email: "ahmed.diop@afrilins.sn",
          telephone: "+221 XX XXX XX XX",
          motDePasse: "",
          actif: true,
          dateCreation: new Date(),
          uniteOrganisationnelle: { nom: "Direction", description: "", niveau: 1 },
          centreGestion: { libelle: "Centre Dakar", code: "CDK" },
          roles: [],
          permissions: [],
          fonctions: [{ libelle: "Directeur", description: "" }],
        },
        centreGestion: { libelle: "Centre Dakar", code: "CDK" },
        concernes: [
          {
            attributs: {
              nom: "SARL InnovTech",
              secteur: "Technologies",
              effectif: 45,
              adresse: "Zone Industrielle, Dakar",
              contact: "M. Sow (DRH)",
            },
            typeConcerne: { libelle: "Employeur", code: "EMP" },
          },
        ],
        documents: [
          {
            type: "PDF",
            document: {
              nom: "Signalements précédents.pdf",
              description: "",
              chemin: "",
              dateAjout: new Date(),
              taille: 0,
              typeDocument: { libelle: "Rapport", code: "RPT" },
            },
          },
          {
            type: "EXCEL",
            document: {
              nom: "Données employés.xlsx",
              description: "",
              chemin: "",
              dateAjout: new Date(),
              taille: 0,
              typeDocument: { libelle: "Données", code: "DATA" },
            },
          },
        ],
      },
      {
        id: 2,
        objet: "Marie Diallo",
        description:
          "Enquête sur la situation professionnelle de Mme Marie Diallo, suite à sa demande de révision de statut et de prestations sociales.",
        dateCreation: new Date("2024-01-19"),
        priorite: "MOYENNE",
        dateEcheance: new Date("2024-02-03"),
        urgent: false,
        etatDemande: { libelle: "En attente", code: "ATTENTE" },
        utilisateurDemandeur: {
          prenom: "Aminata",
          nom: "Ndiaye",
          email: "aminata.ndiaye@afrilins.sn",
          telephone: "+221 XX XXX XX XX",
          motDePasse: "",
          actif: true,
          dateCreation: new Date(),
          uniteOrganisationnelle: { nom: "Service Enquêtes", description: "", niveau: 2 },
          centreGestion: { libelle: "Centre Dakar", code: "CDK" },
          roles: [],
          permissions: [],
          fonctions: [{ libelle: "Chef de service", description: "" }],
        },
        centreGestion: { libelle: "Centre Dakar", code: "CDK" },
        concernes: [
          {
            attributs: {
              nom: "Marie Diallo",
              age: 42,
              profession: "Comptable",
              adresse: "Quartier Liberté, Dakar",
              contact: "+221 XX XXX XX XX",
            },
            typeConcerne: { libelle: "Travailleur", code: "TRV" },
          },
        ],
        documents: [],
      },
      {
        id: 3,
        objet: "Association Solidarité",
        description: "Enquête sur l'Association Solidarité suite à une demande de subvention importante.",
        dateCreation: new Date("2024-01-21"),
        priorite: "HAUTE",
        dateEcheance: new Date("2024-01-31"),
        urgent: true,
        etatDemande: { libelle: "En attente", code: "ATTENTE" },
        utilisateurDemandeur: {
          prenom: "Moussa",
          nom: "Faye",
          email: "moussa.faye@afrilins.sn",
          telephone: "+221 XX XXX XX XX",
          motDePasse: "",
          actif: true,
          dateCreation: new Date(),
          uniteOrganisationnelle: { nom: "Direction Régionale", description: "", niveau: 1 },
          centreGestion: { libelle: "Centre Dakar", code: "CDK" },
          roles: [],
          permissions: [],
          fonctions: [{ libelle: "Directeur régional", description: "" }],
        },
        centreGestion: { libelle: "Centre Dakar", code: "CDK" },
        concernes: [
          {
            attributs: {
              nom: "Association Solidarité",
              creation: "2018",
              domaine: "Aide à l'enfance",
              siege: "Quartier Médina, Dakar",
              president: "M. Ibrahima Seck",
            },
            typeConcerne: { libelle: "Bénéficiaire", code: "BEN" },
          },
        ],
        documents: [],
      },
    ]

    return of(mockData)
  }

  getStats(): Observable<StatsCard[]> {
    const stats: StatsCard[] = [
      { title: "Total assignées", value: 5, icon: "inbox", color: "orange" },
      { title: "Priorité haute", value: 2, icon: "exclamation-triangle", color: "red" },
      { title: "Échéance proche", value: 3, icon: "clock", color: "yellow" },
      { title: "Nouvelles aujourd'hui", value: 1, icon: "calendar-day", color: "blue" },
    ]
    return of(stats)
  }

  accepterDemande(id: number): Observable<boolean> {
    console.log(id)
    return of(true)
  }

  refuserDemande(id: number): Observable<boolean> {
    console.log(id)
    return of(true)
  }
}
