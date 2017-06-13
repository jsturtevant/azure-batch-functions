import argparse
import requests

parser = argparse.ArgumentParser(description='Process some integers.')
parser.add_argument('track', metavar='N', help='pass any value')
args = parser.parse_args()
track = args.track

print('processing request for track: ' + track)
r = requests.get('http://freemusicarchive.org/services/track/single/{0}.json'.format(track))
track_info = r.json()

track_file_url = track_info['track_file_url']
track_handle = track_info['track_handle']

print('downloading track file url: ' + track_file_url)
print('Saving as file: ' + track_handle)

r = requests.get(track_file_url)
with open(track_handle, 'wb') as f:
    f.write(r.content)

print('file download complete')