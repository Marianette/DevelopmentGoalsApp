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
   #  Location.create!(
    #  country: content[COUNTRY],
  #    population:
  #  )
  end

  #location - female population and male population
  #data - type + location + value
  # labour force female and male % of female/male pop
  # gender equality index - bubble graph
  # DO SOMETHING ABOUT UNEMPLOYMENT + PAY GAP!

# Antartica removed from map
# {"type":"MultiPolygon","id":11,"arcs":[[[43]],[[44]],[[45]],[[46]],[[47]],[[48]],[[49]],[[50]],[[51]],[[52]],[[53]],[[54]],[[55]],[[56]],[[57]],[[58]],[[59]],[[60]],[[61]],[[62]],[[63]],[[64]],[[65]],[[66]],[[67]],[[68]],[[69]],[[70]],[[71]],[[72]],[[73]],[[74]],[[75]],[[76]],[[77]],[[78]],[[79]],[[80]],[[81]],[[82]],[[83]],[[84]],[[85]]],"properties":{"admin":"Antarctica","id":"ATA"}},
end
