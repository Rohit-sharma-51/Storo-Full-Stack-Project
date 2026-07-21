function calcPrice(config, weightKg, startAt, endAt) {
  const hours = Math.ceil(
    (new Date(endAt) - new Date(startAt)) / (1000 * 60 * 60)
  );

  return config.base + (config.perKg * weightKg) + (config.perHour * hours);
}

module.exports = { calcPrice };
