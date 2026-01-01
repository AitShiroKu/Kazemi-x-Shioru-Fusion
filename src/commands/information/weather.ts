import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../types/index.js';

export const data = new SlashCommandBuilder()
  .setName('weather')
  .setDescription("See today's weather in each area.")
  .setDescriptionLocalizations({
    th: 'ดูสภาพอากาศของวันนี้ในแต่ละพื้นที่ต้องการ',
  })
  .setContexts([
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ])
  .addStringOption((option) =>
    option
      .setName('city')
      .setDescription("Name of city for which you want to know weather.")
      .setDescriptionLocalizations({
        th: 'ชื่อเมืองที่คุณต้องการทราบสภาพอากาศ',
      })
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('unit')
      .setDescription("Unit of measure for weather conditions.")
      .setDescriptionLocalizations({
        th: 'หน่วยวัดของสภาพอากาศ',
      })
      .addChoices(
        { name: 'Kelvin', value: 'standard' },
        { name: 'Celsius', value: 'metric' },
        { name: 'Fahrenheit', value: 'imperial' },
      ),
  );

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'information';

export async function execute(interaction: ChatInputCommandInteraction) {
  const inputCity = interaction.options.getString('city')!;
  const inputUnit = interaction.options.getString('unit') ?? 'standard';

  await interaction.deferReply();

  const client = interaction.client as any;
  const i18n = client.i18n.t;
  const token = client.configs?.open_weather_token;

  if (!token)
    return await interaction.editReply(i18n('commands.weather.no_token_provider'));

  const geoService = async (query: string): Promise<any> => {
    const geoURL = new URL('https://api.openweathermap.org/geo/1.0/direct');
    geoURL.searchParams.append('q', query);
    geoURL.searchParams.append('appid', token);

    const response = await fetch(geoURL);

    if (response.status !== 200) return response.status;
    const data = (await response.json()) as any;

    if (!data || !data.length) return -1;
    return data;
  };

  const weatherService = async (
    latitude: number,
    longitude: number,
    units: string,
    language: string,
  ): Promise<any> => {
    const service = new URL('https://api.openweathermap.org/data/2.5/weather');

    service.searchParams.append('lat', String(latitude));
    service.searchParams.append('lon', String(longitude));
    service.searchParams.append('units', units);
    service.searchParams.append('lang', language);
    service.searchParams.append('appid', token);

    const response = await fetch(service);

    if (response.status !== 200) return response.status;
    const data = (await response.json()) as any;

    if (!data || !data.weather || !data.weather[0]) return -1;
    return data;
  };

  const tempUnits: Record<string, any> = {
    standard: i18n('commands.weather.kelvin'),
    metric: i18n('commands.weather.celsius'),
    imperial: i18n('commands.weather.fahrenheit'),
  };

  const speedUnits: Record<string, any> = {
    standard: i18n('commands.weather.meter_per_second'),
    metric: i18n('commands.weather.meter_per_second'),
    imperial: i18n('commands.weather.miles_per_hour'),
  };

  const query = inputCity;
  const geoResponse = await geoService(query);

  if (geoResponse === -1)
    return await interaction.editReply(i18n('commands.weather.no_result_found'));

  const geoData = geoResponse[0];
  const latitude = geoData.lat;
  const longitude = geoData.lon;
  const weatherResponse = await weatherService(
    latitude,
    longitude,
    inputUnit,
    interaction.locale,
  );

  if (weatherResponse === -1)
    return await interaction.editReply(
      i18n('commands.weather.error_with_code', {
        status_code: weatherResponse,
      }),
    );

  const tempUnit = tempUnits[inputUnit] || tempUnits.standard;
  const speedUnit = speedUnits[inputUnit] || speedUnits.standard;
  const weather = weatherResponse.weather[0].main;
  const description = weatherResponse.weather[0].description;
  const icon = weatherResponse.weather[0].icon;
  const base = weatherResponse.base;
  const temp = weatherResponse.main.temp;
  const feelsLike = weatherResponse.main.feels_like;
  const tempMin = weatherResponse.main.temp_min;
  const tempMax = weatherResponse.main.temp_max;
  const pressure = weatherResponse.main.pressure;
  const humidity = weatherResponse.main.humidity;
  const seaLevel = weatherResponse.main.sea_level;
  const groundLevel = weatherResponse.main.grnd_level;
  const visibility = weatherResponse.main.visibility;
  const windSpeed = weatherResponse.wind.speed;
  const windDeg = weatherResponse.wind.deg;
  const windGust = weatherResponse.wind.gust;
  const cloudsAll = weatherResponse.clouds.all;
  const rainOneHour = weatherResponse.rain?.['1h'];
  const rainThreeHour = weatherResponse.rain?.['3h'];
  const snowOneHour = weatherResponse.snow?.['1h'];
  const snowThreeHour = weatherResponse.snow?.['3h'];
  const dt = weatherResponse.dt;
  const sysCountry = weatherResponse.sys.country;
  const name = weatherResponse.name;

  const clientAvatar = (interaction.client.user.avatarURL() as string) || '';

  let rainfallValue = i18n('commands.weather.none');
  if (rainThreeHour) {
    rainfallValue = `${String(rainThreeHour)} mm/3h`;
  } else if (rainOneHour) {
    rainfallValue = `${String(rainOneHour)} mm/1h`;
  }

  let snowfallValue = i18n('commands.weather.none');
  if (snowThreeHour) {
    snowfallValue = `${String(snowThreeHour)} mm/3h`;
  } else if (snowOneHour) {
    snowfallValue = `${String(snowOneHour)} mm/1h`;
  }

  const weatherEmbed = new EmbedBuilder()
    .setColor(Colors.Blue)
    .setTitle(i18n('commands.weather.weather'))
    .setDescription(
      i18n('commands.weather.weather_moment', {
        city: name,
        country: sysCountry.toLowerCase(),
        weather: weather,
        description: description,
      }),
    )
    .setTimestamp(dt * 1000)
    .setThumbnail(`https://openweathermap.org/img/wn/${icon}@2x.png`)
    .setFooter({
      text: i18n('commands.weather.time_to_calculate'),
      iconURL: clientAvatar,
    })
    .setFields([
      {
        name: i18n('commands.weather.data_from'),
        value: base,
        inline: true,
      },
      {
        name: i18n('commands.weather.temperature'),
        value: `${String(temp)} ${tempUnit}`,
        inline: true,
      },
      {
        name: i18n('commands.weather.feels_like'),
        value: `${String(feelsLike)} ${tempUnit}`,
        inline: true,
      },
      {
        name: i18n('commands.weather.lowest_temperature'),
        value: `${String(tempMin)} ${tempUnit}`,
        inline: true,
      },
      {
        name: i18n('commands.weather.highest_temperature'),
        value: `${String(tempMax)} ${tempUnit}`,
        inline: true,
      },
      {
        name: i18n('commands.weather.pressure'),
        value: `${String(pressure)} hPa`,
        inline: true,
      },
      {
        name: i18n('commands.weather.humidity'),
        value: `${String(humidity)}%`,
        inline: true,
      },
      {
        name: i18n('commands.weather.sea_level'),
        value: `${String(seaLevel)} hPa`,
        inline: true,
      },
      {
        name: i18n('commands.weather.ground_level'),
        value: `${String(groundLevel)} hPa`,
        inline: true,
      },
      {
        name: i18n('commands.weather.visibility'),
        value: `${String(visibility / 1000)} km`,
        inline: true,
      },
      {
        name: i18n('commands.weather.wind_speed'),
        value: `${String(windSpeed)} ${speedUnit}`,
        inline: true,
      },
      {
        name: i18n('commands.weather.wind_direction'),
        value: `${String(windDeg)}°`,
        inline: true,
      },
      {
        name: i18n('commands.weather.wind_gust'),
        value: `${String(windGust)} ${speedUnit}`,
        inline: true,
      },
      {
        name: i18n('commands.weather.clouds'),
        value: `${String(cloudsAll)}%`,
        inline: true,
      },
      {
        name: i18n('commands.weather.rainfall'),
        value: rainfallValue,
        inline: true,
      },
      {
        name: i18n('commands.weather.snowfall'),
        value: snowfallValue,
        inline: true,
      },
    ]);

  await interaction.editReply({ embeds: [weatherEmbed] });
}
