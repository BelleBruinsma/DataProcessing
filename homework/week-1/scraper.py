#!/usr/bin/env python
# Name: Belle Bruinsma
# Student number: 10676759
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import csv

from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):

    # a list that contains the title, rating, genre, actor, runtime
    results = []

    # Using a for loop to get the titles, ratings, genres and append it into tvserie[]
    for tv in dom.by_tag('div.lister-item-content'):
        tvserie = []

        titles = tv.by_tag('a')[0].content.encode("latin-1")
        tvserie.append(titles)
        ratings = tv.by_tag('strong')[0].content.encode("latin-1")
        tvserie.append(ratings)
        genres = tv.by_tag('span.genre')[0].content.rstrip().replace('\n', '').encode("latin-1")
        tvserie.append(genres)


        # Using a for loop to get the actors and append it into bla[]
        bla = []
        for i in range(4):
            actors = tv.by_tag("p.")[2].by_tag('a')[i].content.encode("latin-1")
            bla.append(actors)
        actors = ', '.join(bla).strip('[]')
        tvserie.append(actors)

        # Get the runtime of all
        runtime = tv.by_tag("span.runtime")[0].content.encode("latin-1")
        tvserie.append(runtime)

        # Append the list of tvserie into results
        results.append(tvserie)

    # Return all the results
    return results


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    writer = csv.writer(f)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # Writes the tv-series to disk
    writer.writerows(tvseries)


if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)

