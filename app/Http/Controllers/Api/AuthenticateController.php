<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Authenticate\CredentialsRequest;
use App\Http\Requests\Api\Authenticate\RegisterDataRequest;
use App\Models\User;
use App\Services\AuthenticateService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\MessageBag;

class AuthenticateController extends Controller
{

    public function __construct(
        private readonly AuthenticateService $authenticateService,
        private readonly MessageBag          $messageBag,
    )
    {
    }

    public function login(CredentialsRequest $request): Response
    {
        $email = $request->get('email');
        $password = $request->get('password');

        if (!$email && !$password) {
            return response([
                'message' => 'Unable to get email or password',
                'errors' => [
                    'password' => ["Provided wrong credentials"]
                ]
            ], 422);
        }

        $user = $this->authenticateService->attemptLogin($email, $password);

        if (!$user) {
            return response([
                'message' => 'Provided wrong credentials',
                'errors' => [
                    'password' => ["Provided wrong credentials"]
                ]
            ], 422);
        }

        return response(['token' => $this->authenticateService->createAccessToken($user)]);
    }

    public function register(RegisterDataRequest $request): Response
    {
        $data = $request->validated();

        /* @var User $user */
        $user = User::query()->create([...$data, 'password' => Hash::make($data['password'])]);
        $user->createAsStripeCustomer();

        return response(['token' => $user->createToken(uniqid())->plainTextToken]);
    }

    public function logout(): Response
    {
        $this->authenticateService->logout();

        return response(['message' => 'Successful log out']);
    }

    public function refresh(Request $request): Response
    {
        $bearerToken = explode("Bearer ", $request->header('Authorization'))[1] ?? null;

        if (!$bearerToken) {
            return response(['message' => 'Empty authorization header'], 422);
        }

        try {
            return response(['token' => $this->authenticateService->refresh($bearerToken)]);
        } catch (\Exception $e) {
            return response([
                'message' => $e->getMessage(),
                'errors' => $this->messageBag->toArray()
            ], 500);
        }
    }
}
