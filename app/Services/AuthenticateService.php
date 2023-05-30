<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\MessageBag;
use Laravel\Sanctum\PersonalAccessToken;

class AuthenticateService
{

    public function __construct(
        private readonly MessageBag $messageBag
    )
    {
    }

    public function attemptLogin(string $email, string $password): ?User
    {
        $canLogin = Auth::attempt([
            'email' => $email,
            'password' => $password
        ]);

        if ($canLogin) {
            /* @type  User */
            return Auth::user();
        }

        return null;
    }

    /**
     * @throws Exception
     */
    public function refresh(string $bearerToken): string
    {
        $token = PersonalAccessToken::findToken($bearerToken);

        if (!$token) {
            $this->messageBag->add('token', 'Invalid access token');

            throw new Exception("Invalid access token");
        }

        /* @var User $user */
        $user = $token->tokenable()->first();

        return $this->createAccessToken($user);
    }

    public function logout(): void
    {
        /* @var  User $user */
        $user = Auth::guard('api')->user();

        /* @var PersonalAccessToken $token */
        $token = $user->currentAccessToken();
        $token->delete();
    }

    public function createAccessToken(User $user): string
    {
        return $user->createToken(uniqid())->plainTextToken;
    }
}
