CREATE TABLE "oauthtry_sessions" (
    "id" text PRIMARY KEY NOT NULL,
    "user_id" integer NOT NULL,
    "expires_at" timestamp with time zone NOT NULL
);

CREATE TABLE "oauthtry_users" (
    "id" serial PRIMARY KEY NOT NULL,
    "google_id" text NOT NULL,
    "email" varchar NOT NULL,
    "name" text NOT NULL,
    "picture" text NOT NULL,
    CONSTRAINT "oauthtry_users_google_id_unique" UNIQUE("google_id"),
    CONSTRAINT "oauthtry_users_email_unique" UNIQUE("email")
);

ALTER TABLE "oauthtry_sessions" ADD CONSTRAINT "oauthtry_sessions_user_id_oauthtry_users_id_fk" 
    FOREIGN KEY ("user_id") REFERENCES "public"."oauthtry_users"("id") 
    ON DELETE no action ON UPDATE no action;

CREATE INDEX "session_user_id_idx" ON "oauthtry_sessions" USING btree ("user_id");
CREATE INDEX "google_id_idx" ON "oauthtry_users" USING btree ("google_id");
CREATE INDEX "email_idx" ON "oauthtry_users" USING btree ("email");
