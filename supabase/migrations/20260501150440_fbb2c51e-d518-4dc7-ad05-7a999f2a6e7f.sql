UPDATE public.site_analytics SET
  device_type = CASE
    WHEN user_agent ~* 'iPad|Tablet|PlayBook|Silk' THEN 'tablet'
    WHEN user_agent ~* 'Mobi|Android|iPhone|iPod|Opera Mini|IEMobile' THEN 'mobile'
    ELSE 'desktop'
  END,
  browser = CASE
    WHEN user_agent ~* 'Edg/' THEN 'Edge'
    WHEN user_agent ~* 'OPR/|Opera' THEN 'Opera'
    WHEN user_agent ~* 'Chrome/' AND user_agent !~* 'Chromium' THEN 'Chrome'
    WHEN user_agent ~* 'Firefox/' THEN 'Firefox'
    WHEN user_agent ~* 'Safari/' AND user_agent !~* 'Chrome' THEN 'Safari'
    WHEN user_agent ~* 'MSIE|Trident' THEN 'IE'
    ELSE 'Other'
  END,
  os = CASE
    WHEN user_agent ~* 'Windows' THEN 'Windows'
    WHEN user_agent ~* 'Android' THEN 'Android'
    WHEN user_agent ~* 'iPhone|iPad|iPod' THEN 'iOS'
    WHEN user_agent ~* 'Mac OS X' THEN 'macOS'
    WHEN user_agent ~* 'Linux' THEN 'Linux'
    ELSE 'Other'
  END
WHERE user_agent IS NOT NULL AND (device_type IS NULL OR browser IS NULL OR os IS NULL);