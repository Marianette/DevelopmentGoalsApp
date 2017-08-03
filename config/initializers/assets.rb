# Version of assets
Rails.application.config.assets.version = '1.0'

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
Rails.application.config.assets.precompile += %w( income.scss
                                                  compare_indicators.scss
                                                  education_and_employment.scss
                                                  gender_inequality.scss )
