<?php

namespace Database\Factories\Providers;

use Faker\Provider\Base;

class AlbumNameProvider extends Base
{
    static array $name = [
        'Forgotten Legends',
        'Autumn Aurora',
        'Лебединий шлях (The Swan Road)',
        'Кров у наших криницях (Blood in Our Wells)',
        'Пісні скорботи і самітності (Songs of Grief and Solitude)',
        'Відчуженість (Estrangement)',
        'Пригорща зірок (Handful of Stars)',
        'Вічний оберт колеса (Eternal Turn of the Wheel)',
        'Всі належать ночі (All Belong to the Night)',
        'Lunar Poetry',
        'Twilight fall',
        'Goat Horns',
        'To the Gates of Blasphemous Fire',
        'Голос сталі',
        'Істина',
        'До лунарної поезії'
    ];

    public static function albumName(): string
    {
        return self::randomElement(self::$name);
    }
}

