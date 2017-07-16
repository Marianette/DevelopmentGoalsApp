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
end
