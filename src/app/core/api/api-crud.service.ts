import {ApiService} from "@core/api/api.service";
import {IParams} from "@core/interfaces/http-options.interface";
import {Observable} from "rxjs";
import {ApiResponse} from "@core/interfaces/api-response.interface";


/**
 * Classe abstraite générique fournissant des méthodes CRUD standardisées
 * pour les services d'accès à une API REST.
 *
 * @typeParam T - Le type de l'entité principale (ex: `EtatDemande`)
 * @typeParam I - Le type des données d'entrée pour `create` et `update` (ex: `EtatDemandeData`)
 *
 * Cette classe est à étendre par les services spécifiques à chaque entité.
 */
export abstract class ApiCrudService<T, D = any> extends ApiService {

  /**
   * Récupère la liste paginée ou filtrée d'entités.
   *
   * @param params - Paramètres de requête HTTP (pagination, filtres, etc.)
   * @returns Un observable contenant une réponse API avec une liste d'entités.
   */
  abstract getAll(params?: IParams): Observable<ApiResponse<T>>;

  /**
   * Récupère une entité spécifique par son identifiant.
   *
   * @param id - Identifiant de l'entité à récupérer
   * @returns Un observable contenant l'entité ou `null` si non trouvée.
   */
  abstract getOne(id: number): Observable<T | null>;

  /**
   * Crée une nouvelle entité à partir des données fournies.
   *
   * @param data - Les données d'entrée nécessaires à la création
   * @returns Un observable contenant l'entité créée.
   */
  abstract create(data: D): Observable<T>;

  /**
   * Met à jour une entité existante avec les données fournies.
   *
   * @param id - Identifiant de l'entité à mettre à jour
   * @param data - Données mises à jour
   * @returns Un observable contenant l'entité mise à jour.
   */
  abstract update(id: number, data: D): Observable<T>;

  /**
   * Supprime une entité par son identifiant.
   *
   * @param id - Identifiant de l'entité à supprimer
   * @returns Un observable contenant `true` si la suppression a réussi, `false` sinon.
   */
  abstract deleteOne(id: number): Observable<boolean>;
}
