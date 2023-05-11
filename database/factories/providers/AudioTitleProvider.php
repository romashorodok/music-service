<?php

namespace Database\Factories\Providers;

use Faker\Provider\Base;

class AudioTitleProvider extends Base
{
    static array $titles = [
        'False Dawn',
        'Forests in Fire and Gold',
        'Eternal Turn of the Wheel',
        'Smell of Rain',
        'Fading',
        'Summoning the Rain',
        'Glare of Autumn',
        'Sun wheel',
        'Wind of the Night Forests',
        'The First Snow',
        'Вічне сонце (Eternal Sun)',
        'Кров (Blood)',
        'Ціна волі (The Price of Freedom)',
        'Доля',
        'Дума про руйнування Січі (Song of Sich Destruction)',
        'Навь (Nav)',
        'Борозни богів (Furrows of Gods)',
        'Коли пломінь перетворюється на попіл (When the Flame Turns to Ashes)',
        'Самітність (Solitude)',
        'Вічність (Eternity)',
        'Українська повстанська армія (Ukrainian Insurgent Army)',
        'Захід сонця в Карпатах (Sunset in Carpathians)',
        'Сльози богів (Tears of Gods)',
        'Стародавній танець (Archaic Dance)',
        'Чумацький шлях (The Milky Way)',
        'Чому буває сумне сонце (Why the Sun Becomes Sad)',
        'Журавлі ніколи не повернуться сюди (The Cranes Will Never Return Here)',
        'Сивий степ (Grey-Haired Steppe)',
        'Самітня нескінченна тропа (Solitary Endless Path)',
        'Небо у наших ніг (Skies at Our Feet)',
        'Там, де закінчуються обрії (Where Horizons End)',
        'Тільки вітер пам\'ятає моє ім\'я (Only the Wind Remembers My Name)',
        'Холодні краєвиди (Cold Landscapes)',
        'Загибель епохи (Downfall of the Epoch)',
        'До світла (Towards the Light)',
        'Ореол з сутінок (Twilight Aureole)',
        'Прийде день (The Day Will Come)',
        'Слухаючи тишу (Listening to the Silence)',
        'Млини (Windmills)',
        'Листопад (November)',
        'Поки зникнем у млі (Till We Become the Haze)',
    ];

    public static function audioTitle(): string
    {
        return self::randomElement(self::$titles);
    }
}
