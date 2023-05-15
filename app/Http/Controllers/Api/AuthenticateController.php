<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Authenticate\CredentialsRequest;
use App\Http\Requests\Api\Authenticate\RegisterDataRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\PersonalAccessToken;

class AuthenticateController extends Controller
{

    public function login(CredentialsRequest $request): Response
    {
        $email = $request->get('email');
        $password = $request->get('password');

        $credentials = $request->validated();

        if (!$email && !$password) {
            return response(['message' => 'Unable to get email or password'], 422);
        }

        $canLogin = Auth::attempt($credentials);
        /* @var  User $user */
        $user = Auth::user();

        if (!$canLogin || !$user) {
            return response(['message' => 'User dont exists'], 404);
        }

        return response(['token' => $user->createToken(uniqid())->plainTextToken]);
    }

    public function register(RegisterDataRequest $request): Response
    {
        $data = $request->validated();

        /* @var User $user */
        $user = User::query()->create([...$data, 'password' => Hash::make($data['password'])]);

        return response(['token' => $user->createToken(uniqid())->plainTextToken]);
    }

    public function logout(): Response
    {
        /* @var  User $user */
        $user = Auth::guard('api')->user();

        /* @var PersonalAccessToken $token */
        $token = $user->currentAccessToken();
        $token->delete();

        return response(['message' => 'Successful log out']);
    }

    public function refresh(Request $request): Response
    {
        $bearerToken = explode("Bearer ", $request->header('Authorization'))[1] ?? null;

        if (!$bearerToken) {
            return response(['message' => 'Empty authorization header'], 422);
        }

        $token = PersonalAccessToken::findToken($bearerToken);

        if (!$token) {
            return response(['message' => 'Invalid access token']);
        }

        $user = $token->tokenable()->first();

        return response(['token' => $user->createToken(uniqid())->plainTextToken]);
    }
}
