import { useDispatch, useSelector } from "react-redux";
import type { EstadoRaiz, DespachoAplicacion } from "../Api/store";

// Hooks tipados del store, igual que el backoffice.
export const useAppDispatch = useDispatch.withTypes<DespachoAplicacion>();
export const useAppSelector = useSelector.withTypes<EstadoRaiz>();
