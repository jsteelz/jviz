import os
import signal
import sys
import shutil
import http.server
import socketserver
from tools.conversion_tools import convert_calendars, convert_routes, convert_shapes, convert_trips

def signal_handler(sig, frame):
  print('\n\nClosing visualizer, deleting visualizer files. Please wait a tiny bit.')
  try:
    shutil.rmtree('.visualizefiles')
  except:
    print('No previous visualized files found on close. Weird.')
  exit(0)

if __name__ == "__main__":
  signal.signal(signal.SIGINT, signal_handler)

  gtfs_dir = ''

  try:
    in_dir = sys.argv[1]
  except:
    print("Error: must specify GTFS directory as arg")
    exit(1)

  try:
    shutil.rmtree('.visualizefiles')
  except:
    print('No previous visualized files found. Generating vis files.')
  os.mkdir('.visualizefiles')

  calendar_file = os.path.join(in_dir, "calendar.txt")
  calendar_dates_file = os.path.join(in_dir, "calendar_dates.txt")
  cal_dir = os.path.join('.visualizefiles', 'service_jkeys_by_date')
  os.mkdir(cal_dir)
  convert_calendars(calendar_file, calendar_dates_file, cal_dir)

  routes_file = os.path.join(in_dir, "routes.txt")
  routes_dir = os.path.join('.visualizefiles', 'routes')
  os.mkdir(routes_dir)
  routes_obj = convert_routes(routes_file, routes_dir)

  shapes_file = os.path.join(in_dir, "shapes.txt")
  shapes_dir = os.path.join('.visualizefiles', 'shapes')
  os.mkdir(shapes_dir)
  convert_shapes(shapes_file, shapes_dir)

  stops_file = os.path.join(in_dir, "stops.txt")
  trips_file = os.path.join(in_dir, "trips.txt")
  stop_times_file = os.path.join(in_dir, "stop_times.txt")
  stops_dir = os.path.join('.visualizefiles', 'stops')
  trips_dir = os.path.join('.visualizefiles', 'trips')
  itin_dir = os.path.join('.visualizefiles', 'itineraries')
  trips_hour_dir = os.path.join('.visualizefiles', 'trips_by_route_by_hour')
  os.mkdir(stops_dir)
  os.mkdir(trips_dir)
  os.mkdir(itin_dir)
  os.mkdir(trips_hour_dir)
  convert_trips(stops_file, trips_file, stop_times_file, stops_dir, trips_dir, itin_dir, trips_hour_dir, routes_dir, routes_obj)

  # start server
  PORT = 8000

  Handler = http.server.SimpleHTTPRequestHandler

  with socketserver.TCPServer(("", PORT), Handler) as httpd:
      print('ready to serve visualize files at localhost:8000/.visualizefiles')
      httpd.serve_forever()
