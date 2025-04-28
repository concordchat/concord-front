import { api } from "./api";
import { LOGIN_USER, REGISTER_USER } from "../constants/api_routes";
import { RootObjectUser, LoginCredentials, ObjectUserLogin, AuthResponse, APIResponse } from "../types";
import { AxiosError } from "axios";

export class AuthError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'AuthError';
  }
}

export const register = async (user: RootObjectUser["user"]): Promise<AuthResponse> => {
  try {
    const payload: RootObjectUser = { user };
    const response = await api.post<APIResponse<AuthResponse>>(REGISTER_USER, payload);
    return response.data.data.attributes;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.errors?.[0] || "Erro ao registrar usuário";
      throw new AuthError(message, error.response?.status);
    }
    throw new AuthError("Erro ao registrar usuário");
  }
};

export const login = async (user: LoginCredentials): Promise<AuthResponse> => {
  try {
    const payload: ObjectUserLogin = { user };
    const response = await api.post<APIResponse<AuthResponse>>(LOGIN_USER, payload);
    return response.data.data.attributes;
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data?.errors?.[0] || "Email ou senha inválidos";
      throw new AuthError(message, error.response?.status);
    }
    throw new AuthError("Erro ao fazer login");
  }
};
