-- Create a view that shows user roles with email and name
create or replace view public.user_roles_with_details as
select 
  ur.id,
  ur.user_id,
  ur.role,
  ur.created_at,
  p.email,
  p.name
from public.user_roles ur
left join public.profiles p on ur.user_id = p.id;

-- Grant select permission on the view
grant select on public.user_roles_with_details to authenticated;

-- RLS policy for the view
alter view public.user_roles_with_details set (security_invoker = on);