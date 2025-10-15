-- Function to assign default role to new users
create or replace function public.handle_new_user_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Assign 'admin' role by default (you can change this logic)
  insert into public.user_roles (user_id, role)
  values (new.id, 'admin');
  return new;
end;
$$;

-- Trigger to automatically assign role when user signs up
create trigger on_auth_user_created_assign_role
  after insert on auth.users
  for each row execute function public.handle_new_user_role();