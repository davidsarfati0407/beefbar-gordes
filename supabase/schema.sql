-- Beefbar Gordes — table des réservations.
-- À exécuter dans l'éditeur SQL de Supabase.

create table if not exists public.reservations (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),

  first_name   text        not null,
  last_name    text        not null,
  email        text        not null,
  phone        text        not null,

  reserved_on  date        not null,
  reserved_at  text        not null,          -- créneau, ex. « 20:00 »
  guests       smallint    not null check (guests between 1 and 12),
  message      text,

  status       text        not null default 'pending'
                           check (status in ('pending', 'confirmed', 'cancelled')),

  -- Traçabilité de l'envoi des emails de confirmation.
  emails_sent  boolean     not null default false
);

create index if not exists reservations_reserved_on_idx
  on public.reservations (reserved_on, reserved_at);

create index if not exists reservations_created_at_idx
  on public.reservations (created_at desc);

-- Le site écrit via la service role key depuis un Route Handler serveur.
-- RLS activé et aucune policy publique : la table n'est jamais lisible
-- ni écrivable depuis le navigateur avec la clé anon.
alter table public.reservations enable row level security;
