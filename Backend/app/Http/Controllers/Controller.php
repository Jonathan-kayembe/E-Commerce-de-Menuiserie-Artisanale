<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests; // pour les autorisations
use Illuminate\Foundation\Validation\ValidatesRequests; // pour les validations de formulaires
use Illuminate\Routing\Controller as BaseController; // pour les contrôleurs

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests; // pour les autorisations et les validations de formulaires
}
