class PopulateDatabase
  attr_reader :hashes, :type

  FIELDS = {
    COUNTRY: 'country',
    REGION: 'region'
  }.freeze

  def initialize(hashes, type)
    @hashes = hashes
    @type = type
  end

  def call
    hashes.each do |hash|
      send(type, hash)
    end
  end

  private

  def location(contents)
  end

  # location - female population and male population
  # labour force female and male % of female/male pop - choropleth ...potential tree map?
  # gender equality index - bubble graph
  # secondary schooling male and female - choropleth
  # national income male and female - dot/line graph

end
