import argparse

parser = argparse.ArgumentParser(description='Process some integers.')
parser.add_argument('value', metavar='N', help='pass any value')

args = parser.parse_args()

print(args.value)