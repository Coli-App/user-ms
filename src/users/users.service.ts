import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { createSupabaseAdminClient } from "src/providers/supabase/supabase";

@Injectable()
export class UsersService {
  private supabase: any;
  constructor(private configService: ConfigService) {
    this.supabase = createSupabaseAdminClient(this.configService);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { data: authResult, error: authError } =
      await this.supabase.auth.admin.createUser({
        email: createUserDto.email,
        password: createUserDto.password,
        email_confirm: true,
      });

    if (authError) {
      throw new Error(`Error al crear usuario en Auth: ${authError.message}`);
    }

    const newUser = {
      name: createUserDto.name,
      email: createUserDto.email,
      rol: createUserDto.rol,
      auth_id: authResult.user?.id,
    };
    const { data, error } = await this.supabase
      .from("User")
      .insert([newUser])
      .select()
      .single();

    if (error) {
      throw new Error(`Error al crear usuario en la tabla: ${error.message}`);
    }

    const { error: updateError } = await this.supabase.auth.admin.updateUserById(
      authResult.user?.id,
      {
        app_metadata: {
          user_id: data.id,
          user_role: createUserDto.rol
        }
      }
    );

    if (updateError) {
      throw new Error(`Error al actualizar metadata del usuario: ${updateError.message}`);
    }

    return data;
  }

  async findAll(): Promise<User[]> {
    const { data, error } = await this.supabase.from("User").select("*");

    if (error) throw error;
    return data;
  }

  async findOne(id: string): Promise<User> {
    const { data, error } = await this.supabase
      .from("User")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { data: user, error: fetchError } = await this.supabase
      .from("User")
      .select("auth_id")
      .eq("id", id)
      .single();

    if (fetchError)
      throw new Error(`Error al obtener auth_id: ${fetchError.message}`);

    const authUpdates: any = {};
    if (updateUserDto.email) {
      authUpdates.email = updateUserDto.email;
      authUpdates.email_confirm = true;
    }

    if (updateUserDto.password) {
      authUpdates.password = updateUserDto.password;
    }

    

    if (Object.keys(authUpdates).length > 0) {
      await this.updateAuthUser(user.auth_id, authUpdates);
    }

    const { password, ...userTableData } = updateUserDto;
    const { data, error } = await this.supabase
      .from("User")
      .update(userTableData)
      .eq("id", id);

    if (error)
      throw new Error(
        `Error al actualizar usuario en la tabla: ${error.message}`
      );
    return data;
  }

  async remove(id: string): Promise<void> {
    const { data: user, error: fetchError } = await this.supabase
      .from("User")
      .select("auth_id")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw new Error(`Error al buscar el usuario: ${fetchError.message}`);
    }

    if (!user) {
      throw new Error(`Usuario con ID ${id} no encontrado`);
    }

    const { error: authError } = await this.supabase.auth.admin.deleteUser(
      user.auth_id
    );

    if (authError) {
      throw new Error(
        `Error al eliminar usuario del Auth: ${authError.message}`
      );
    }

    const { error: deleteError } = await this.supabase
      .from("User")
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw new Error(
        `Error al eliminar usuario en la tabla: ${deleteError.message}`
      );
    }
  }

  async createUserAuth(email: string, password: string): Promise<any> {
    const { data, error } = await this.supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    return { data, error };
  }
  async updateAuthUser(
    authId: string,
    updates: { email?: string; password?: string }
  ) {
    const { data, error } = await this.supabase.auth.admin.updateUserById(
      authId,
      updates
    );

    if (error) {
      throw new Error(`Error al actualizar usuario en Auth: ${error.message}`);
    }

    return data;
  }
}
