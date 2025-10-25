import { AutreInfoModel, AutreInfoRequestData } from "@core/model/autre-info.model";

export function isAutreInfoModel(
  data: AutreInfoModel | AutreInfoRequestData
): data is AutreInfoModel {
  return "id" in data;
}