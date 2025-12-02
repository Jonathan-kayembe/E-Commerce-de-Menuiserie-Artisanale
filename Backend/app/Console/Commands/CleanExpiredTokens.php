<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CleanExpiredTokens extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tokens:clean';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Supprime les tokens expirés de la base de données';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            $deleted = DB::table('api_tokens')
                ->where('expires_at', '<', now())
                ->orWhere(function ($query) {
                    $query->whereNull('expires_at')
                        ->where('created_at', '<', now()->subDays(30)); // Supprimer les tokens sans expiration après 30 jours
                })
                ->delete();

            $this->info("Supprimé {$deleted} token(s) expiré(s).");
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error("Erreur lors du nettoyage : " . $e->getMessage());
            return Command::FAILURE;
        }
    }
}

